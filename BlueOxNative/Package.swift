// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "BlueOxNative",
    platforms: [
        .macOS(.v15)
    ],
    products: [
        .library(
            name: "BlueOxNative",
            targets: ["BlueOxNative"]),
    ],
    dependencies: [
        .package(url: "https://github.com/apple/swift-markdown.git", from: "0.4.0"),
    ],
    targets: [
        .target(
            name: "BlueOxNative",
            dependencies: [
                .product(name: "Markdown", package: "swift-markdown")
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency")
            ]
        ),
    ]
)
