import SwiftUI
import SwiftData

struct EditorView: View {
    @Bindable var note: Note
    @State private var showPreview = true
    @State private var autoSaveTask: Task<Void, Never>?

    var body: some View {
        HSplitView {
            // Editor pane
            VStack(spacing: 0) {
                // Title editor
                TextField("Note Title", text: $note.title, axis: .vertical)
                    .font(.title.bold())
                    .textFieldStyle(.plain)
                    .padding()
                    .background(.ultraThinMaterial)

                Divider()

                // Content editor
                TextEditor(text: $note.content)
                    .font(.system(size: 16, design: .monospaced))
                    .scrollContentBackground(.hidden)
                    .background(.clear)
                    .padding()
            }
            .frame(minWidth: 400)

            if showPreview {
                // Preview pane
                MarkdownPreview(content: note.content)
                    .frame(minWidth: 400)
            }
        }
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button(action: { showPreview.toggle() }) {
                    Label("Toggle Preview", systemImage: showPreview ? "eye.slash" : "eye")
                }
            }
        }
        .onChange(of: note.content) { oldValue, newValue in
            // Auto-save with debounce
            autoSaveTask?.cancel()
            autoSaveTask = Task {
                try? await Task.sleep(for: .seconds(2))
                if !Task.isCancelled {
                    note.updatedAt = Date()

                    // Update title from first line if it starts with #
                    if let firstLine = newValue.components(separatedBy: .newlines).first,
                       firstLine.hasPrefix("#") {
                        let title = firstLine.replacingOccurrences(of: "#", with: "")
                            .trimmingCharacters(in: .whitespaces)
                        if !title.isEmpty {
                            note.title = title
                        }
                    }
                }
            }
        }
    }
}

struct MarkdownPreview: View {
    let content: String

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                // Simple markdown rendering for now
                // TODO: Use swift-markdown for proper rendering
                ForEach(content.components(separatedBy: .newlines), id: \.self) { line in
                    if line.hasPrefix("# ") {
                        Text(line.dropFirst(2))
                            .font(.largeTitle.bold())
                    } else if line.hasPrefix("## ") {
                        Text(line.dropFirst(3))
                            .font(.title.bold())
                    } else if line.hasPrefix("### ") {
                        Text(line.dropFirst(4))
                            .font(.title2.bold())
                    } else if !line.isEmpty {
                        Text(line)
                            .font(.body)
                    }
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding()
        }
        .background(.ultraThinMaterial)
    }
}

#Preview {
    EditorView(note: Note(
        title: "Sample Note",
        content: "# Hello\n\nThis is a test note."
    ))
}
