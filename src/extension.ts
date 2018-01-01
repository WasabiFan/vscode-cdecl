import * as vscode from 'vscode';
import { fork } from 'child_process';
import { Readable } from 'stream';
import * as path from 'path'
import { MessageItem, Uri } from 'vscode';
import { join, resolve } from 'path';

interface CdeclResult {
    output: string;
    isError: boolean;
}

async function invokeCdecl(input: string): Promise<CdeclResult> {
    return new Promise<CdeclResult>((resolve, reject) => {
        const child = fork(join(__dirname, 'cdecl.js'), [input], { stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ] });

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

async function invokeCdeclAndDisplayResult(command: string, text: string) {
    const result = text.startsWith(command) ? await invokeCdecl(text) : await invokeCdecl(`${command} ${text}`);
    if(result.isError) {
        const help = "Help";
        const bannerResult = await vscode.window.showErrorMessage(result.output, help);
        if(bannerResult == help) {
            vscode.commands.executeCommand('cdecl.help');
        }
    }
    else {
        vscode.window.showInformationMessage(result.output);
    }
}

export function activate(context: vscode.ExtensionContext) {

    context.subscriptions.push(vscode.commands.registerCommand('cdecl.help', async () => {
        const htmlUri = Uri.file(resolve(__dirname, "../assets/help.html"));
        await vscode.commands.executeCommand('vscode.previewHtml', htmlUri, vscode.ViewColumn.One, 'cdecl Help');
    }));

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

        await invokeCdeclAndDisplayResult('explain', selectedText);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('cdecl.explainTyped', async () => {
        const text = await vscode.window.showInputBox({
            prompt: "C gibberish to explain",
            placeHolder: "e.g. \"int (*(*foo)(void ))[3]\""
        });

        if(!text) {
            return;
        }

        await invokeCdeclAndDisplayResult('explain', text);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('cdecl.declare', async () => {
        const text = await vscode.window.showInputBox({
            prompt: "Declare...",
            placeHolder: "e.g. \"foo as pointer to function (void) returning pointer to array 3 of int\""
        });

        if(!text) {
            return;
        }

        await invokeCdeclAndDisplayResult('declare', text);
    }));


    context.subscriptions.push(vscode.commands.registerCommand('cdecl.cast', async () => {
        const text = await vscode.window.showInputBox({
            prompt: "Cast...",
            placeHolder: "e.g. \"foo into pointer to const int\" or \"foo into block(int, long long) returning double\""
        });

        if(!text) {
            return;
        }

        await invokeCdeclAndDisplayResult('cast', text);
    }));
}

// this method is called when your extension is deactivated
export function deactivate() {
}