# Local QR code dependencies

- Runtime encoder: qrcode-generator 2.0.4, Kazuhiko Arase, MIT. Source: https://github.com/kazuhikoarase/qrcode-generator/tree/js2.0.4/js . Downloaded from https://raw.githubusercontent.com/kazuhikoarase/qrcode-generator/js2.0.4/js/dist/qrcode.js . The original header and separate qrcode-LICENSE.txt are retained; the build also embeds the MIT license in the standalone HTML.
- Test-only independent decoder: jsQR 1.4.0, MIT. Source: https://github.com/cozmo/jsQR . Distribution: https://registry.npmjs.org/jsqr/-/jsqr-1.4.0.tgz . Copied into tests/vendor with its license. It is not included in the website build.

The prototype QR contains non-payable demo order text, including an explicit do-not-pay notice. Neither dependency sends any order data to a remote QR service.

SHA-256:

- vendor/qrcode.cjs: 79ec86f82856005b1c887905cfccfcfbec3821ca61c7fd5a952faa5f778f791c
- tests/vendor/jsqr.cjs: bc40c8a15196236b2314db0856f72ca0b49980cd5413b8c852a7349f5fee0859
