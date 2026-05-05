package expo.modules.networkimage

import android.content.Context
import android.graphics.Outline
import android.view.View
import android.view.ViewOutlineProvider
import android.widget.FrameLayout
import android.widget.ImageView
import coil3.load
import coil3.request.crossfade
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView

class NetworkImageView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  private val imageView = ImageView(context)

  private var cornerRadiusPx: Float = 0f

  init {
    imageView.scaleType = ImageView.ScaleType.CENTER_CROP
    imageView.layoutParams = FrameLayout.LayoutParams(
      FrameLayout.LayoutParams.MATCH_PARENT,
      FrameLayout.LayoutParams.MATCH_PARENT
    )
    addView(imageView)
    clipToOutline = true
  }

  fun setUri(uri: String) {
    imageView.load(uri) {
      crossfade(true)
    }
  }

  fun setCornerRadius(radiusDp: Float) {
    val density = resources.displayMetrics.density
    cornerRadiusPx = radiusDp * density
    outlineProvider = object : ViewOutlineProvider() {
      override fun getOutline(view: View, outline: Outline) {
        outline.setRoundRect(0, 0, view.width, view.height, cornerRadiusPx)
      }
    }
    invalidateOutline()
  }

  fun setContentModeString(mode: String) {
    imageView.scaleType = when (mode) {
      "contain" -> ImageView.ScaleType.FIT_CENTER
      "fill" -> ImageView.ScaleType.FIT_XY
      else -> ImageView.ScaleType.CENTER_CROP
    }
  }
}
