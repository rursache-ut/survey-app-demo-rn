import ExpoModulesCore

public class NetworkImageModule: Module {
  public func definition() -> ModuleDefinition {
    Name("NetworkImage")

    View(NetworkImageView.self) {
      Prop("uri") { (view: NetworkImageView, uri: String) in
        view.setURI(uri)
      }

      Prop("cornerRadius") { (view: NetworkImageView, radius: Double) in
        view.setCornerRadius(CGFloat(radius))
      }

      Prop("contentMode") { (view: NetworkImageView, mode: String) in
        view.setContentModeString(mode)
      }
    }
  }
}
