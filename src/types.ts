/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VirtualFile {
  id: string;
  name: string;
  type: 'file';
  content: string;
  size: number;
  createdAt: number;
}

export interface VirtualFolder {
  id: string;
  name: string;
  type: 'folder';
  isLocked: boolean;
  isHidden: boolean;
  items: (VirtualFile | VirtualFolder)[];
  createdAt: number;
}

export type VaultState = 'setup' | 'locked' | 'unlocked';
