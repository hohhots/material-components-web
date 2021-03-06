/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import {MDCFoundation} from '@mongol/base/foundation';
import {MDCChipSetAdapter} from './adapter';
import {cssClasses, strings} from './constants';

export class MDCChipSetFoundation extends MDCFoundation<MDCChipSetAdapter> {
  static get strings() {
    return strings;
  }

  static get cssClasses() {
    return cssClasses;
  }

  static get defaultAdapter(): MDCChipSetAdapter {
    return {
      hasClass: () => false,
      removeChip: () => undefined,
      setSelected: () => undefined,
    };
  }

  /**
   * The ids of the selected chips in the set. Only used for choice chip set or filter chip set.
   */
  private selectedChipIds_: string[] = [];

  constructor(adapter?: Partial<MDCChipSetAdapter>) {
    super({...MDCChipSetFoundation.defaultAdapter, ...adapter});
  }

  /**
   * Returns an array of the IDs of all selected chips.
   */
  getSelectedChipIds(): ReadonlyArray<string> {
    return this.selectedChipIds_.slice();
  }

  /**
   * Selects the chip with the given id. Deselects all other chips if the chip set is of the choice variant.
   */
  select(chipId: string) {
    if (this.selectedChipIds_.indexOf(chipId) >= 0) {
      return;
    }

    if (this.adapter_.hasClass(cssClasses.CHOICE) && this.selectedChipIds_.length > 0) {
      const previouslySelectedChip = this.selectedChipIds_[0];
      this.selectedChipIds_.length = 0;
      this.adapter_.setSelected(previouslySelectedChip, false);
    }
    this.selectedChipIds_.push(chipId);
    this.adapter_.setSelected(chipId, true);
  }

  /**
   * Handles a chip interaction event
   */
  handleChipInteraction(chipId: string) {
    if (this.adapter_.hasClass(cssClasses.CHOICE) || this.adapter_.hasClass(cssClasses.FILTER)) {
      this.toggleSelect_(chipId);
    }
  }

  /**
   * Handles a chip selection event, used to handle discrepancy when selection state is set directly on the Chip.
   */
  handleChipSelection(chipId: string, selected: boolean) {
    const chipIsSelected = this.selectedChipIds_.indexOf(chipId) >= 0;
    if (selected && !chipIsSelected) {
      this.select(chipId);
    } else if (!selected && chipIsSelected) {
      this.deselect_(chipId);
    }
  }

  /**
   * Handles the event when a chip is removed.
   */
  handleChipRemoval(chipId: string) {
    this.deselect_(chipId);
    this.adapter_.removeChip(chipId);
  }

  /**
   * Deselects the chip with the given id.
   */
  private deselect_(chipId: string) {
    const index = this.selectedChipIds_.indexOf(chipId);
    if (index >= 0) {
      this.selectedChipIds_.splice(index, 1);
      this.adapter_.setSelected(chipId, false);
    }
  }

  /**
   * Toggles selection of the chip with the given id.
   */
  private toggleSelect_(chipId: string) {
    if (this.selectedChipIds_.indexOf(chipId) >= 0) {
      this.deselect_(chipId);
    } else {
      this.select(chipId);
    }
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCChipSetFoundation;
