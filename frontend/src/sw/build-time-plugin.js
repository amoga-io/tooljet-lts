class BuildTimePlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('BuildTimePlugin', (compilation, callback) => {
      const buildTime = new Date().toISOString();
      const buildTimeComment = `\n/* Build time: ${buildTime} */\n`;

      // Target only the service worker file
      const swFilename = 'sw.js'; // Make sure this matches your swDest in WorkboxPlugin

      if (compilation.assets[swFilename]) {
        const source = compilation.assets[swFilename].source();
        const updatedSource = source + buildTimeComment;
        compilation.assets[swFilename] = {
          source: () => updatedSource,
          size: () => updatedSource.length,
        };
      }

      callback();
    });
  }
}

module.exports = BuildTimePlugin;
