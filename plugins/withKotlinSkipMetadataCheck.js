const { withProjectBuildGradle } = require('@expo/config-plugins');

const SNIPPET = `
allprojects {
  tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).configureEach {
    kotlinOptions {
      freeCompilerArgs += "-Xskip-metadata-version-check"
    }
  }
  configurations.all {
    resolutionStrategy {
      force "org.jetbrains.kotlin:kotlin-stdlib:2.1.0"
      force "org.jetbrains.kotlin:kotlin-stdlib-jdk7:2.1.0"
      force "org.jetbrains.kotlin:kotlin-stdlib-jdk8:2.1.0"
    }
  }
}
`;

function withKotlinSkipMetadataCheck(config) {
  return withProjectBuildGradle(config, (cfg) => {
    if (!cfg.modResults.contents.includes('Xskip-metadata-version-check')) {
      cfg.modResults.contents += SNIPPET;
    }
    return cfg;
  });
}

module.exports = withKotlinSkipMetadataCheck;
