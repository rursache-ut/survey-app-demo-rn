import ExpoModulesCore
import UIKit
#if canImport(Kingfisher)
import Kingfisher
#endif

public final class NetworkImageView: ExpoView {
  private let imageView = UIImageView()
  private var currentURI: String?
  private var cornerRadius: CGFloat = 0

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    clipsToBounds = true
    layer.masksToBounds = true
    imageView.frame = bounds
    imageView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    imageView.contentMode = .scaleAspectFill
    imageView.clipsToBounds = true
    imageView.layer.masksToBounds = true
    addSubview(imageView)
  }

  public func setURI(_ uri: String) {
    guard uri != currentURI else { return }
    currentURI = uri
    guard let url = URL(string: uri) else {
      imageView.image = nil
      return
    }
    loadImage(url: url)
  }

  private func loadImage(url: URL) {
    #if canImport(Kingfisher)
    var options: KingfisherOptionsInfo = [
      .transition(.fade(0.15)),
      .cacheOriginalImage
    ]
    if cornerRadius > 0 {
      options.append(.processor(RoundCornerImageProcessor(cornerRadius: cornerRadius)))
    }
    imageView.kf.indicatorType = .activity
    imageView.kf.setImage(with: url, options: options)
    #else
    URLSession.shared.dataTask(with: url) { [weak self] data, _, _ in
      guard let self, let data, let image = UIImage(data: data) else { return }
      DispatchQueue.main.async { self.imageView.image = image }
    }.resume()
    #endif
  }

  public func setCornerRadius(_ radius: CGFloat) {
    cornerRadius = radius
    layer.cornerRadius = radius
    imageView.layer.cornerRadius = radius
    if let urlString = currentURI, let url = URL(string: urlString) {
      // Re-apply with the round-corner processor so Kingfisher bakes the radius.
      currentURI = nil
      setURI(urlString)
      _ = url
    }
  }

  public func setContentModeString(_ mode: String) {
    switch mode {
    case "contain":
      imageView.contentMode = .scaleAspectFit
    case "fill":
      imageView.contentMode = .scaleToFill
    default:
      imageView.contentMode = .scaleAspectFill
    }
  }
}
