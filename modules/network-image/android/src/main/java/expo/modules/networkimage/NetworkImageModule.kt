package expo.modules.networkimage

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class NetworkImageModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("NetworkImage")

    View(NetworkImageView::class) {
      Prop("uri") { view: NetworkImageView, uri: String ->
        view.setUri(uri)
      }
      Prop("cornerRadius") { view: NetworkImageView, radius: Double ->
        view.setCornerRadius(radius.toFloat())
      }
      Prop("contentMode") { view: NetworkImageView, mode: String ->
        view.setContentModeString(mode)
      }
    }
  }
}
