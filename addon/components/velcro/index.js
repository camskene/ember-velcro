import Component from '@glimmer/component';
import { action } from '@ember/object';
import { createPopper } from '@popperjs/core';
import { inject as service } from '@ember/service';
import { modifier } from 'ember-modifier';

export default class VelcroComponent extends Component {
  @service resizeObserver;

  _targetElement = undefined;
  _popoverElement = undefined;
  _popper = undefined;

  velcroTarget = modifier((element) => {
    this._targetElement = element;
    this.resizeObserver.observe(element, this._updatePopper);

    return () => {
      this.resizeObserver.unobserve(element, this._updatePopper);
    };
  });

  velcro = modifier((element) => {
    this._popoverElement = element;

    this._createPopper();
    this.resizeObserver.observe(element, this._updatePopper);

    return () => {
      this._popper.destroy();
      this.resizeObserver.unobserve(element, this._updatePopper);
    };
  });

  @action
  _createPopper() {
    this._popper = createPopper(
      this._targetElement,
      this._popoverElement,
      this._popperOptions
    );
  }

  @action
  _updatePopper() {
    this._popper.update();
  }

  @action
  _popperOptions() {
    return {
      placement: this.args.placement ?? 'bottom',
      modifiers: this._modifiers,
      strategy: this.args.strategy ?? 'absolute',
      onFirstUpdate: this.args.onFirstUpdate?.(),
    };
  }

  get _modifiers() {
    return [this._offsetModifier, ...(this.args.modifiers ?? [])];
  }

  get _offsetModifier() {
    return {
      name: 'offset',
      options: {
        offset: [
          parseInt(this.args.offsetSkidding, 10) ?? 0,
          parseInt(this.args.offsetDistance, 10) ?? 0,
        ],
      },
    };
  }
}
