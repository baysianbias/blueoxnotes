import SwiftData
import Foundation

@Model
final class Note {
    @Attribute(.unique) var id: UUID
    var title: String
    var content: String
    var folder: String
    var tags: [String]
    var createdAt: Date
    var updatedAt: Date
    var deletedAt: Date?

    init(title: String = "Untitled Note",
         content: String = "# New Note\n\nStart writing...",
         folder: String = "root",
         tags: [String] = []) {
        self.id = UUID()
        self.title = title
        self.content = content
        self.folder = folder
        self.tags = tags
        self.createdAt = Date()
        self.updatedAt = Date()
        self.deletedAt = nil
    }

    var isDeleted: Bool {
        deletedAt != nil
    }
}

@Model
final class Folder {
    @Attribute(.unique) var id: UUID
    var name: String
    var parentId: UUID?
    var collapsed: Bool
    var createdAt: Date
    var updatedAt: Date

    init(name: String, parentId: UUID? = nil, collapsed: Bool = false) {
        self.id = UUID()
        self.name = name
        self.parentId = parentId
        self.collapsed = collapsed
        self.createdAt = Date()
        self.updatedAt = Date()
    }
}

@Model
final class AppConfig {
    @Attribute(.unique) var id: UUID
    var theme: String
    var sidebarWidth: Double
    var editorFontSize: Double
    var editorFontFamily: String
    var lineHeight: Double
    var showLineNumbers: Bool
    var autoSave: Bool
    var autoSaveInterval: Int
    var vimMode: Bool
    var spellCheck: Bool
    var livePreview: Bool
    var defaultView: String

    init() {
        self.id = UUID()
        self.theme = "dark"
        self.sidebarWidth = 280
        self.editorFontSize = 16
        self.editorFontFamily = "SF Mono"
        self.lineHeight = 1.6
        self.showLineNumbers = true
        self.autoSave = true
        self.autoSaveInterval = 2000
        self.vimMode = false
        self.spellCheck = true
        self.livePreview = true
        self.defaultView = "split"
    }
}
