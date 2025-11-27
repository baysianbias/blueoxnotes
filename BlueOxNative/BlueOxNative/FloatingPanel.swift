import AppKit
import SwiftUI

/// Floating panel that stays on top - like Inkdrop
class FloatingPanelController: NSObject {
    private var panel: NSPanel!
    private var hostingView: NSHostingView<FloatingPanelContent>!

    override init() {
        super.init()
        setupPanel()
    }

    private func setupPanel() {
        // Create the panel with specific behaviors
        panel = NSPanel(
            contentRect: NSRect(x: 100, y: 100, width: 320, height: 500),
            styleMask: [.titled, .closable, .resizable, .nonactivatingPanel, .fullSizeContentView],
            backing: .buffered,
            defer: false
        )

        panel.title = "Quick Notes"
        panel.level = .floating  // Always on top
        panel.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary]
        panel.isFloatingPanel = true
        panel.becomesKeyOnlyIfNeeded = true
        panel.hidesOnDeactivate = false

        // Frosted glass effect
        panel.isOpaque = false
        panel.backgroundColor = .clear
        panel.titlebarAppearsTransparent = true

        // Set up SwiftUI content
        let contentView = FloatingPanelContent(close: { [weak self] in
            self?.panel.orderOut(nil)
        })

        hostingView = NSHostingView(rootView: contentView)
        hostingView.frame = panel.contentView!.bounds
        hostingView.autoresizingMask = [.width, .height]

        panel.contentView?.addSubview(hostingView)

        // Show by default
        panel.orderFront(nil)
    }

    func show() {
        panel.orderFront(nil)
        panel.makeKey()
    }

    func toggle() {
        if panel.isVisible {
            panel.orderOut(nil)
        } else {
            show()
        }
    }
}

struct FloatingPanelContent: View {
    @State private var quickNotes: [QuickNote] = []
    @State private var newNoteText = ""
    let close: () -> Void

    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                Text("Quick Notes")
                    .font(.headline)
                    .foregroundStyle(.primary)

                Spacer()

                Button(action: close) {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundStyle(.secondary)
                }
                .buttonStyle(.plain)
            }
            .padding()
            .background(.ultraThinMaterial)

            Divider()

            // Quick note input
            HStack(spacing: 8) {
                TextField("Quick note...", text: $newNoteText)
                    .textFieldStyle(.plain)
                    .onSubmit {
                        addQuickNote()
                    }

                Button(action: addQuickNote) {
                    Image(systemName: "plus.circle.fill")
                        .foregroundStyle(.blue)
                }
                .buttonStyle(.plain)
                .disabled(newNoteText.isEmpty)
            }
            .padding()
            .background(.regularMaterial)

            // Notes list
            ScrollView {
                LazyVStack(spacing: 8) {
                    ForEach(quickNotes) { note in
                        QuickNoteRow(note: note) {
                            deleteQuickNote(note)
                        }
                    }
                }
                .padding()
            }
        }
        .background(.ultraThinMaterial)
    }

    private func addQuickNote() {
        guard !newNoteText.isEmpty else { return }
        let note = QuickNote(text: newNoteText)
        quickNotes.insert(note, at: 0)
        newNoteText = ""
    }

    private func deleteQuickNote(_ note: QuickNote) {
        quickNotes.removeAll { $0.id == note.id }
    }
}

struct QuickNote: Identifiable {
    let id = UUID()
    let text: String
    let createdAt = Date()
}

struct QuickNoteRow: View {
    let note: QuickNote
    let onDelete: () -> Void

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            VStack(alignment: .leading, spacing: 4) {
                Text(note.text)
                    .font(.body)

                Text(note.createdAt, style: .relative)
                    .font(.caption2)
                    .foregroundStyle(.secondary)
            }

            Spacer()

            Button(action: onDelete) {
                Image(systemName: "trash")
                    .foregroundStyle(.red)
            }
            .buttonStyle(.plain)
        }
        .padding(12)
        .background(.regularMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 8))
    }
}
