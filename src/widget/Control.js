import PropTypes from 'prop-types';
import React from 'react';
import { List } from 'immutable';

export default class Control extends React.Component {
    componentValidate = {};

    constructor(props) {
        super(props);
        this.state = {
            sliceSelectionIndex: -1
        };
    }

    static propTypes = {
        onChange: PropTypes.func.isRequired,
        forID: PropTypes.string,
        value: PropTypes.node,
        classNameWrapper: PropTypes.string.isRequired,
    }

    static defaultProps = {
        value: List(),
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

    controlFor(field, fieldValue, key, onChange) {
        const {
            onValidateObject,
            clearFieldErrors,
            metadata,
            fieldsErrors,
            editorControl: EditorControl,
            controlRef,
        } = this.props;

        return (
            <EditorControl
                key={key}
                field={field}
                value={fieldValue}
                onChange={onChange}
                clearFieldErrors={clearFieldErrors}
                fieldsMetaData={metadata}
                fieldsErrors={fieldsErrors}
                onValidate={onValidateObject}
                processControlRef={controlRef && controlRef.bind(this)}
                controlRef={controlRef}
            />
        );
    }

    render() {
        const { field, forID, value, classNameWrapper, onChange } = this.props,
            { sliceSelectionIndex } = this.state,
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
                {value && value.map((v, idx) => {
                    return <div>
                        {sliceSelectionIndex === idx &&
                            <Slices sliceNames={fieldNames} onSelect={sliceName => {
                                onChange(value.insert(idx, { sliceName }));
                                this.setState({ sliceSelectionIndex: -1 });
                            }} />}
                        {sliceSelectionIndex !== idx && <button onClick={e => {
                            e.preventDefault();
                            this.setState({ sliceSelectionIndex: idx })
                        }}>+</button>}
                        {idx !== 0 && <button>Up</button>}
                        {idx !== 0 && <button>Dn</button>}
                        <button onClick={e => {
                            e.preventDefault();
                            onChange(value.remove(idx))
                        }}>Del</button>
                        {this.controlFor(fieldsMap[v.sliceName], v.sliceValue, idx, (sliceName, sliceValue) => {
                            onChange(value.set(idx, { sliceName, sliceValue }));
                        })}
                        {(idx === value.len - 1) && <button>+</button>}
                    </div>
                })}

                <Slices sliceNames={fieldNames} onSelect={sliceName => onChange(value.push({ sliceName }))} />
            </React.Fragment>
        );
    }
}

const Slices = ({ sliceNames, onSelect }) => (
    <div>
        {sliceNames && sliceNames.map(name => <button onClick={(e) => {
            e.preventDefault();
            onSelect(name);
        }}>
            {name}
        </button>)}
    </div>
)
