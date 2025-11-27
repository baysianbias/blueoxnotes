import SwiftUI

struct SettingsView: View {
    @AppStorage("theme") private var theme = "auto"
    @AppStorage("editorFontSize") private var editorFontSize = 16.0
    @AppStorage("lineHeight") private var lineHeight = 1.6
    @AppStorage("autoSave") private var autoSave = true
    @AppStorage("spellCheck") private var spellCheck = true
    @AppStorage("vimMode") private var vimMode = false

    var body: some View {
        TabView {
            // Editor tab
            Form {
                Section("Editor") {
                    Slider(value: $editorFontSize, in: 12...24, step: 1) {
                        Text("Font Size: \(Int(editorFontSize))px")
                    }

                    Slider(value: $lineHeight, in: 1.2...2.0, step: 0.1) {
                        Text("Line Height: \(lineHeight, specifier: "%.1f")")
                    }

                    Toggle("Auto Save", isOn: $autoSave)
                    Toggle("Spell Check", isOn: $spellCheck)
                    Toggle("Vim Mode", isOn: $vimMode)
                }
            }
            .padding()
            .tabItem {
                Label("Editor", systemImage: "doc.text")
            }

            // Appearance tab
            Form {
                Section("Appearance") {
                    Picker("Theme", selection: $theme) {
                        Text("Auto").tag("auto")
                        Text("Light").tag("light")
                        Text("Dark").tag("dark")
                    }
                    .pickerStyle(.segmented)
                }

                Section("Window") {
                    Button("Show Floating Panel") {
                        NotificationCenter.default.post(name: .showFloatingPanel, object: nil)
                    }
                }
            }
            .padding()
            .tabItem {
                Label("Appearance", systemImage: "paintbrush")
            }

            // Sync tab
            Form {
                Section("iCloud Sync") {
                    Toggle("Enable iCloud Sync", isOn: .constant(true))
                    Text("Your notes are automatically synced via iCloud")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
            .padding()
            .tabItem {
                Label("Sync", systemImage: "icloud")
            }
        }
        .frame(width: 500, height: 400)
    }
}

#Preview {
    SettingsView()
}
