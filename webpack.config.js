const path = require('path');

module.exports = {
  // Punto de entrada de la aplicación
  entry: './src/index.js',

  // Configuración de salida del bundle
  output: {
    filename: 'bundle.js', // Nombre del archivo de salida
    path: path.resolve(__dirname, 'docs'), // Ruta de salida
  },
  devtool: 'source-map',
  // Modo de compilación
  mode: 'development',

  // Configuración del servidor de desarrollo
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'docs'), // Ruta de contenido estático
    },
    compress: true, // Habilita la compresión gzip
    port: 9000, // Puerto del servidor de desarrollo
  },

  // Configuración de loaders
  module: {
    rules: [
      {
        test: /\.js$/, // Archivos que terminan en .js
        exclude: /node_modules/, // Excluir la carpeta node_modules
        use: {
          loader: 'babel-loader', // Usar babel-loader para transpilar ES6+
          options: {
            presets: ['@babel/preset-env'], // Preset para ES6+
          },
        },
      },
      {
        test: /\.css$/, // Archivos que terminan en .css
        use: ['style-loader', 'css-loader'], // Loaders para procesar CSS
      },
    ],
  },
};