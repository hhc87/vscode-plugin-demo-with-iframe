// @ts-nocheck
const vscode = require('vscode')
const fs = require('fs')
const path = require('path')

function getExtensionFileAbsolutePath(context, relativePath) {
	return path.join(context.extensionPath, relativePath)
}

/**
 * Replace resource files with ones recognizable by VS Code."
 * @param {*} context
 * @param {*} templatePath 
 */
async function getWebViewContent(context, templatePath) {
	const resourcePath = getExtensionFileAbsolutePath(context, templatePath)
	const dirPath = path.dirname(resourcePath)
	let html = fs.readFileSync(resourcePath, 'utf-8')
	html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
		return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"'
	})
	return html
}

module.exports = function (context) {
	let panelList = {}
	let panel = null

	// create iframe page
	context.subscriptions.push(vscode.commands.registerCommand('extension.openLowcodePage', (uri) => {
		if (uri) {
			let fileName = path.basename(uri._fsPath)
			panel = vscode.window.createWebviewPanel(
				uri._fsPath,
				fileName,
				vscode.ViewColumn.One,
				{
					enableScripts: true,
					retainContextWhenHidden: true,
				}
			)

			panel.onDidChangeViewState(e => {
				if (panel.visible) {
					pclintBar.show()
				} else {
					pclintBar.hide()
				}
			})
			getWebViewContent(context, 'src/view/index.html').then((html) => {
				panel.webview.html = html
			})

			panel.onDidDispose(e => {
				pclintBar.dispose()
				panelList[fileId] = undefined
				delete panelList[fileId]
			})
			panelList[fileId] = panel
		}
	}))
}
