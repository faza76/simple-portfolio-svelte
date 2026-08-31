---
title: "Rust + WebAssembly: Building a Real-Time Inventory Scanner"
date: "Sep 22, 2024"
category: "Performance"
description: "Replacing a Python-based barcode processing pipeline with Rust compiled to WASM — 40x faster, zero dependencies."
tags: ["Rust", "WebAssembly", "Performance", "Edge Computing"]
author: "SYS_ARCHITECT"
readingTime: "6 min"
featured: false
---

The inventory scanner was fast enough when it ran on a server. It was not fast enough when it needed to run on a handheld device with a flaky cellular connection. The Python pipeline — image decode, barcode detection, inventory lookup — took 340ms per scan. On a good day. On a bad day, with a cold cache and a slow network, it was north of a second.

The goal: make it fast enough to feel instant on a $200 Android phone running a browser-based app. No native SDK. No server round-trip for the decode step. Just browser, WASM, and the camera API.

## Why Rust

The existing pipeline was Python with `pyzbar` and `Pillow`. It worked. It was also pulling in a dependency tree that included OpenSSL, libjpeg, and a half-dozen C libraries compiled for ARM. The binary was 120MB. The WASM build of the same pipeline using `wasm-bindgen` was 8MB — but still slow, because Python-in-WASM is not fast, it's just portable.

Rust compiles to WASM natively, with no runtime overhead. The resulting `.wasm` file is small, and the execution speed is close to native. The trade-off: Rust is harder to write. But for a pipeline that does one thing — decode an image, detect a barcode, hash the result — the surface area is small enough that the difficulty is manageable.

## The pipeline

Three stages, each a function:

```rust
#[wasm_bindgen]
pub fn process_image(buffer: &[u8], width: u32, height: u32) -> Option<String> {
    let gray = to_grayscale(buffer, width, height);
    let barcode = detect_barcode(&gray, width, height)?;
    let code = decode_barcode(&barcode, &gray, width, height)?;
    Some(code)
}
```

1. **Grayscale conversion.** The camera gives us RGBA. We need grayscale for barcode detection. This is a simple loop — no SIMD needed, though Rust's `std::simd` (nightly) would make it faster if we needed it.

2. **Barcode detection.** We use a simplified version of the ZBar algorithm — edge detection, line scanning, and pattern matching. The full ZBar library is 200KB of C; our Rust port is 40KB and handles Code 128 and QR, which is all we need.

3. **Barcode decoding.** Once we have the barcode region, we decode the pattern into a string. This is pure math — no external dependencies.

## The build

`wasm-pack` handles the build:

```toml
[package]
name = "inventory-scanner"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
js-sys = "0.3"
web-sys = "0.3"
```

```bash
wasm-pack build --target web --release
```

The `--target web` flag produces a `.wasm` file and a JS glue file that works with a simple `<script type="module">`. No bundler required, no npm required. Just two files served from a CDN.

## The numbers

| Metric | Python (server) | Rust+WASM (browser) |
| --- | --- | --- |
| Decode time (p50) | 340ms | 8ms |
| Decode time (p99) | 1,200ms | 22ms |
| Binary size | 120MB | 40KB |
| Cold start | 2.1s | 12ms |
| Network dependency | Required | None |

The 40x improvement on p50 is almost entirely from eliminating the network round-trip. The pure compute improvement is about 8x — Python's `pyzbar` is doing C calls under the hood, but the overhead of the interpreter, the GIL, and the `Pillow` image allocation adds up.

## What we skipped

- **SIMD.** The grayscale conversion and barcode detection could benefit from WASM SIMD instructions. We didn't need the performance — 8ms is already fast enough.
- **Shared memory.** We considered `SharedArrayBuffer` for streaming large images. The images are small (640x480) and fit in a single buffer, so we didn't bother.
- **Web Workers.** The pipeline is fast enough to run on the main thread without dropping frames. If we needed to process video frames at 30fps, we'd move it to a worker.

## The real win

The performance numbers are nice. The real win is architectural: the decode step is now **stateless and portable**. It runs in the browser, on the edge, in a Cloudflare Worker, or in a Node.js server — all from the same `.wasm` file. No Python runtime, no native dependencies, no compilation step at deploy time. The `.wasm` file is an asset, not a build artifact.

The scanner went from "fragile server-dependent pipeline" to "drop-in anywhere binary." That's the real value of WASM: not speed, but portability with speed.
