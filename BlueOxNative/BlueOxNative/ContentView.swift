import SwiftUI
import SwiftData

struct ContentView: View {
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \Note.updatedAt, order: .reverse) private var notes: [Note]
    @State private var selectedNote: Note?
    @State private var searchText = ""

    var filteredNotes: [Note] {
        if searchText.isEmpty {
            return notes.filter { !$0.isDeleted }
        }
        return notes.filter { note in
            !note.isDeleted && (
                note.title.localizedCaseInsensitiveContains(searchText) ||
                note.content.localizedCaseInsensitiveContains(searchText)
            )
        }
    }

    var body: some View {
        NavigationSplitView {
            // Sidebar - gets Liquid Glass automatically in macOS 26!
            VStack(spacing: 0) {
                // Search bar
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundStyle(.secondary)
                    TextField("Search notes...", text: $searchText)
                        .textFieldStyle(.plain)
                }
                .padding(8)
                .background(.quaternary.opacity(0.5))
                .clipShape(RoundedRectangle(cornerRadius: 8))
                .padding()

                // Notes list
                List(selection: $selectedNote) {
                    ForEach(filteredNotes) { note in
                        NoteListItem(note: note)
                            .tag(note)
                    }
                }
                .listStyle(.sidebar)
                .searchable(text: $searchText)
            }
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button(action: createNote) {
                        Label("New Note", systemImage: "plus")
                    }
                }

                ToolbarItem(placement: .navigation) {
                    Button(action: toggleSidebar) {
                        Label("Toggle Sidebar", systemImage: "sidebar.left")
                    }
                }
            }
            .frame(minWidth: 250)

        } detail: {
            if let note = selectedNote {
                EditorView(note: note)
            } else {
                ContentUnavailableView(
                    "No Note Selected",
                    systemImage: "doc.text",
                    description: Text("Select a note from the sidebar or create a new one")
                )
            }
        }
        .onReceive(NotificationCenter.default.publisher(for: .newNote)) { _ in
            createNote()
        }
    }

    private func createNote() {
        let note = Note()
        modelContext.insert(note)
        selectedNote = note
    }

    private func toggleSidebar() {
        NSApp.keyWindow?.firstResponder?.tryToPerform(#selector(NSSplitViewController.toggleSidebar(_:)), with: nil)
    }
}

struct NoteListItem: View {
    let note: Note

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(note.title)
                .font(.headline)
                .lineLimit(1)

            Text(note.updatedAt, style: .relative)
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .padding(.vertical, 4)
    }
}

#Preview {
    ContentView()
        .modelContainer(for: Note.self, inMemory: true)
}
