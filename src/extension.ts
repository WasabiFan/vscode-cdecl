import * as vscode from 'vscode';
import { fork } from 'child_process';
import { Readable } from 'stream';
import * as path from 'path'
import { MessageItem } from 'vscode';

interface CdeclResult {
    output: string;
    isError: boolean;
}

async function cdecl(input: string): Promise<CdeclResult> {
    return new Promise<CdeclResult>((resolve, reject) => {
        const child = fork(path.join(__dirname, 'cdecl.js'), [input], { stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ] });

        let outputBuffer = "";
        child.stdout.on('data', data => {
            outputBuffer += data.toString();
        });

        child.on('exit', code => {
            if(code != 0 ) {
                reject(`Child cdecl process exited with error code ${code}`);
                return;
            }

            resolve({
                output: outputBuffer.replace(/^\s+|\s+$/g, ''),
                isError: outputBuffer.indexOf("syntax error") >= 0
            });
        });
    });
}

async function explain(text: string) {
    const result = await cdecl(`explain ${text}`);
    if(result.isError) {
        vscode.window.showErrorMessage(result.output);
    }
    else {
        vscode.window.showInformationMessage(result.output);
    }
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('cdecl.explainSelected', async () => {
        if(!vscode.window.activeTextEditor) {
            vscode.window.showErrorMessage("There is currently no active editor to explain text from. Try the \"cdecl: Explain typed text\" command instead.");
            return;
        }

        const selectedText = vscode.window.activeTextEditor.document.getText(vscode.window.activeTextEditor.selection);
        if(!selectedText) {
            vscode.window.showErrorMessage("There is currently no selected text to explain. Try the \"cdecl: Explain typed text\" command instead.");
            return;
        }

        explain(selectedText);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('cdecl.explainTyped', async () => {
        const text = await vscode.window.showInputBox({
            prompt: "C gibberish to explain",
            placeHolder: "e.g. \"int (*(*foo)(void ))[3]\""
        });

        if(!text) {
            return;
        }

        explain(text);
    }));
}

// this method is called when your extension is deactivated
export function deactivate() {
}