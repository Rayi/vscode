/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from 'vs/base/common/event';
import { TPromise } from 'vs/base/common/winjs.base';
import { IWindowService, IWindowsService, INativeOpenDialogOptions, IEnterWorkspaceResult, IMessageBoxResult, IWindowConfiguration, IDevToolsOptions } from 'vs/platform/windows/common/windows';
import { IRecentlyOpened } from 'vs/platform/history/common/history';
import { ISerializableCommandAction } from 'vs/platform/actions/common/actions';
import { IWorkspaceFolderCreationData } from 'vs/platform/workspaces/common/workspaces';
import { ParsedArgs } from 'vs/platform/environment/common/environment';
import { URI } from 'vs/base/common/uri';
import { Disposable } from 'vs/base/common/lifecycle';

export class WindowService extends Disposable implements IWindowService {

	readonly onDidChangeFocus: Event<boolean>;
	readonly onDidChangeMaximize: Event<boolean>;

	_serviceBrand: any;

	private _hasFocus: boolean;
	get hasFocus(): boolean { return this._hasFocus; }

	constructor(
		private windowId: number,
		private configuration: IWindowConfiguration,
		@IWindowsService private windowsService: IWindowsService
	) {
		super();

		const onThisWindowFocus = Event.map(Event.filter(windowsService.onWindowFocus, id => id === windowId), _ => true);
		const onThisWindowBlur = Event.map(Event.filter(windowsService.onWindowBlur, id => id === windowId), _ => false);
		const onThisWindowMaximize = Event.map(Event.filter(windowsService.onWindowMaximize, id => id === windowId), _ => true);
		const onThisWindowUnmaximize = Event.map(Event.filter(windowsService.onWindowUnmaximize, id => id === windowId), _ => false);
		this.onDidChangeFocus = Event.any(onThisWindowFocus, onThisWindowBlur);
		this.onDidChangeMaximize = Event.any(onThisWindowMaximize, onThisWindowUnmaximize);

		this._hasFocus = document.hasFocus();
		this.isFocused().then(focused => this._hasFocus = focused);
		this._register(this.onDidChangeFocus(focus => this._hasFocus = focus));
	}

	getCurrentWindowId(): number {
		return this.windowId;
	}

	getConfiguration(): IWindowConfiguration {
		return this.configuration;
	}

	pickFileFolderAndOpen(options: INativeOpenDialogOptions): TPromise<void> {
		options.windowId = this.windowId;

		return this.windowsService.pickFileFolderAndOpen(options);
	}

	pickFileAndOpen(options: INativeOpenDialogOptions): TPromise<void> {
		options.windowId = this.windowId;

		return this.windowsService.pickFileAndOpen(options);
	}

	pickFolderAndOpen(options: INativeOpenDialogOptions): TPromise<void> {
		options.windowId = this.windowId;

		return this.windowsService.pickFolderAndOpen(options);
	}

	pickWorkspaceAndOpen(options: INativeOpenDialogOptions): TPromise<void> {
		options.windowId = this.windowId;

		return this.windowsService.pickWorkspaceAndOpen(options);
	}

	reloadWindow(args?: ParsedArgs): TPromise<void> {
		return this.windowsService.reloadWindow(this.windowId, args);
	}

	openDevTools(options?: IDevToolsOptions): TPromise<void> {
		return this.windowsService.openDevTools(this.windowId, options);
	}

	toggleDevTools(): TPromise<void> {
		return this.windowsService.toggleDevTools(this.windowId);
	}

	closeWorkspace(): TPromise<void> {
		return this.windowsService.closeWorkspace(this.windowId);
	}

	enterWorkspace(path: string): TPromise<IEnterWorkspaceResult | undefined> {
		return this.windowsService.enterWorkspace(this.windowId, path);
	}

	createAndEnterWorkspace(folders?: IWorkspaceFolderCreationData[], path?: string): TPromise<IEnterWorkspaceResult | undefined> {
		return this.windowsService.createAndEnterWorkspace(this.windowId, folders, path);
	}

	saveAndEnterWorkspace(path: string): TPromise<IEnterWorkspaceResult | undefined> {
		return this.windowsService.saveAndEnterWorkspace(this.windowId, path);
	}

	openWindow(paths: URI[], options?: { forceNewWindow?: boolean, forceReuseWindow?: boolean, forceOpenWorkspaceAsFile?: boolean, args?: ParsedArgs }): TPromise<void> {
		return this.windowsService.openWindow(this.windowId, paths, options);
	}

	closeWindow(): TPromise<void> {
		return this.windowsService.closeWindow(this.windowId);
	}

	toggleFullScreen(): TPromise<void> {
		return this.windowsService.toggleFullScreen(this.windowId);
	}

	setRepresentedFilename(fileName: string): TPromise<void> {
		return this.windowsService.setRepresentedFilename(this.windowId, fileName);
	}

	getRecentlyOpened(): TPromise<IRecentlyOpened> {
		return this.windowsService.getRecentlyOpened(this.windowId);
	}

	focusWindow(): TPromise<void> {
		return this.windowsService.focusWindow(this.windowId);
	}

	isFocused(): TPromise<boolean> {
		return this.windowsService.isFocused(this.windowId);
	}

	isMaximized(): TPromise<boolean> {
		return this.windowsService.isMaximized(this.windowId);
	}

	maximizeWindow(): TPromise<void> {
		return this.windowsService.maximizeWindow(this.windowId);
	}

	unmaximizeWindow(): TPromise<void> {
		return this.windowsService.unmaximizeWindow(this.windowId);
	}

	minimizeWindow(): TPromise<void> {
		return this.windowsService.minimizeWindow(this.windowId);
	}

	onWindowTitleDoubleClick(): TPromise<void> {
		return this.windowsService.onWindowTitleDoubleClick(this.windowId);
	}

	setDocumentEdited(flag: boolean): TPromise<void> {
		return this.windowsService.setDocumentEdited(this.windowId, flag);
	}

	show(): TPromise<void> {
		return this.windowsService.showWindow(this.windowId);
	}

	showMessageBox(options: Electron.MessageBoxOptions): TPromise<IMessageBoxResult> {
		return this.windowsService.showMessageBox(this.windowId, options);
	}

	showSaveDialog(options: Electron.SaveDialogOptions): TPromise<string> {
		return this.windowsService.showSaveDialog(this.windowId, options);
	}

	showOpenDialog(options: Electron.OpenDialogOptions): TPromise<string[]> {
		return this.windowsService.showOpenDialog(this.windowId, options);
	}

	updateTouchBar(items: ISerializableCommandAction[][]): TPromise<void> {
		return this.windowsService.updateTouchBar(this.windowId, items);
	}

	resolveProxy(url: string): Promise<string | undefined> {
		return this.windowsService.resolveProxy(this.windowId, url);
	}
}
