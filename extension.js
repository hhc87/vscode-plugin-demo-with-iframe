const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
exports.activate = function(context) {
  require('./src/openLowcodePage')(context)
}

/**
 * relase active
 */
exports.deactivate = function() { }
