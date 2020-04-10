import PropTypes from 'prop-types';
import React from 'react';
import { Map, List } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { ClassNames } from '@emotion/core';

export default class Control extends React.Component {
    componentValidate = {};

    constructor(props) {
        super(props);
        this.state = {
            slices: [],
        };
    }

    static propTypes = {
        onChange: PropTypes.func.isRequired,
        forID: PropTypes.string,
        value: PropTypes.node,
        classNameWrapper: PropTypes.string.isRequired,
    }

    static defaultProps = {
        value: Map(),
    };

    shouldComponentUpdate() {
        return true;
    }

    validate = () => {
        const { field } = this.props;
        let fields = field.get('field') || field.get('fields');
        fields = List.isList(fields) ? fields : List([fields]);
        fields.forEach(field => {
            if (field.get('widget') === 'hidden') return;
            this.componentValidate[field.get('name')]();
        });
    };

    controlFor(field, key) {
        const {
            value,
            onChangeObject,
            onValidateObject,
            clearFieldErrors,
            metadata,
            fieldsErrors,
            editorControl: EditorControl,
            controlRef,
        } = this.props;

        if (field.get('widget') === 'hidden') {
            return null;
        }
        const fieldName = field.get('name');
        const fieldValue = value && Map.isMap(value) ? value.get(fieldName) : value;
        console.log(field, fieldValue, "in...")
        return (
            <EditorControl
                key={key}
                field={field}
                value={fieldValue}
                onChange={(n, v) => console.log(n, v, "val")}
                clearFieldErrors={clearFieldErrors}
                fieldsMetaData={metadata}
                fieldsErrors={fieldsErrors}
                onValidate={onValidateObject}
                processControlRef={controlRef && controlRef.bind(this)}
                controlRef={controlRef}
            />
        );
    }

    renderFields = (multiFields, singleField) => {
        if (multiFields) {
            return multiFields.map((f, idx) => this.controlFor(f, idx));
        }
        return this.controlFor(singleField);
    };

    render() {
        const { field, forID, value, classNameWrapper, onChange, forList } = this.props,
            fields = field.get('fields'),
            fieldNames = fields.map(f => f.get('name')),
            fieldsMap = fields.reduce((r, f) => {
                r[f.get('name')] = f;
                return r;
            }, {});
        return (
            <React.Fragment>
                <input
                    type="text"
                    id={forID}
                    className={classNameWrapper}
                    value={value || ''}
                    onChange={e => onChange(e.target.value)}
                />
                {fields && this.renderFields(fields)}
                {fieldNames && fieldNames.map(fn => <button onClick={(e) => {
                    e.preventDefault();
                }}>
                    {fn}
                </button>)
                }
            </React.Fragment >
        );
    }
}