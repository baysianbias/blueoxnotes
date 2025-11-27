import SwiftUI
import SwiftData

@main
struct BlueOxApp: App {
    @NSApplicationDelegateAdaptor(AppDelegate.self) var appDelegate

    var sharedModelContainer: ModelContainer = {
        let schema = Schema([
            Note.self,
            Folder.self,
            AppConfig.self,
        ])
        let modelConfiguration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)

        do {
            return try ModelContainer(for: schema, configurations: [modelConfiguration])
        } catch {
            fatalError("Could not create ModelContainer: \(error)")
        }
    }()

    @State private var floatingPanelController: FloatingPanelController?

    var body: some Scene {
        WindowGroup {
            ContentView()
                .frame(minWidth: 1000, minHeight: 600)
        }
        .modelContainer(sharedModelContainer)
        .commands {
            SidebarCommands()
            TextEditingCommands()

            CommandGroup(after: .newItem) {
                Button("New Note") {
                    NotificationCenter.default.post(name: .newNote, object: nil)
                }
                .keyboardShortcut("n", modifiers: [.command])
            }

            CommandGroup(replacing: .help) {
                Button("BlueOx Help") {
                    // Open help
                }
            }
        }

        Settings {
            SettingsView()
                .frame(width: 600, height: 400)
        }
    }
}

// App Delegate for custom setup
class AppDelegate: NSObject, NSApplicationDelegate {
    var floatingPanelController: FloatingPanelController?

    func applicationDidFinishLaunching(_ notification: Notification) {
        // Set up floating panel
        floatingPanelController = FloatingPanelController()
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return false // Keep running for floating panel
    }
}

extension Notification.Name {
    static let newNote = Notification.Name("newNote")
    static let showFloatingPanel = Notification.Name("showFloatingPanel")
}
