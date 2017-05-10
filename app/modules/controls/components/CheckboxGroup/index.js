import React, { Component } from 'react';

import bindAll from 'lodash/bindAll';
import { bem, bemMix } from 'app/utils/bem';

import ChoiceButton from 'app/modules/controls/components/ChoiceButton';

const b = bem('CheckboxGroup');

export default class CheckboxGroup extends Component {
    static propTypes = {
        className: React.PropTypes.string,
        name: React.PropTypes.string.isRequired,
        options: React.PropTypes.arrayOf(React.PropTypes.shape({
            value: React.PropTypes.string.isRequired,
            title: React.PropTypes.string.isRequired
        })).isRequired,
        value: React.PropTypes.array,
        onChange: React.PropTypes.func
    };

    state = {
        value: this.props.value || []
    };

    constructor(props) {
        super(props);

        bindAll(this, ['onChange']);
    }

    onChange(e, { value, checked }) {
        const selected = this.state.value.slice();
        const index = selected.indexOf(value);

        if (checked && index < 0) {
            selected.push(value);
        } else {
            selected.splice(index, 1);
        }

        this.setState({ value: selected });

        if (this.props.onChange) {
            this.props.onChange(e, selected);
        }
    }

    render() {
        const {
            className,
            name,
            options
        } = this.props;

        return (
            <div className={bemMix(b(), className)}>
                {options.map((option) => (
                    <ChoiceButton
                        key={option.value}
                        type="checkbox"
                        name={name}
                        value={option.value}
                        title={option.title}
                        checked={this.state.value.includes(option.value)}
                        onChange={this.onChange}
                    />
                ))}
            </div>
        );
    }
}