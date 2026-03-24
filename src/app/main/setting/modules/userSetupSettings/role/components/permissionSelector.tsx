import { Collapse, Checkbox, Row, Col, Tag } from 'antd';
import { useMemo, useEffect } from 'react';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import '../../../../style.css'
import type { PermissionGroup, PermissionItem } from '../../../../../../../types/main/user';
import AppText from '../../../../../../../components/text';


interface PermissionSelectorProps {
    groups: PermissionGroup[];
    value?: number[];                      // RHF value — flat ID array
    onChange?: (val: number[]) => void;    // RHF onChange — emits flat ID array
    defaultValue?: PermissionItem[];       // edit — array of permission objects
}

const PermissionSelector = ({
    groups,
    value = [],
    onChange,
    defaultValue,
}: PermissionSelectorProps) => {

    // On mount in edit mode — extract IDs from permission objects and seed RHF
    useEffect(() => {
        if (defaultValue?.length && !value?.length) {
            onChange?.(defaultValue.map(p => p.id));
        }
    }, [defaultValue]);

    // Derive selected ID set for lookup
    const selectedIds = useMemo(() => new Set(value), [value]);

    // Auto-open groups that have pre-selected permissions
    const defaultOpenKeys = useMemo(() => {
        if (!defaultValue?.length) return [];
        const preSelectedIds = new Set(defaultValue.map(p => p.id));
        return groups
            .filter(g => g.permissions.some(p => preSelectedIds.has(p.id)))
            .map(g => g.group);
    }, [defaultValue, groups]);


    const togglePermission = (id: number, checked: boolean) => {
        const next = new Set(selectedIds);
        if (checked) next.add(id);
        else next.delete(id);
        onChange?.(Array.from(next));
    };

    const toggleGroup = (group: PermissionGroup, checked: boolean) => {
        const next = new Set(selectedIds);
        group.permissions.forEach(p => {
            if (checked) next.add(p.id);
            else next.delete(p.id);
        });
        onChange?.(Array.from(next));
    };

    const toggleAll = (checked: boolean) => {
        if (!checked) { onChange?.([]); return; }
        onChange?.(groups.flatMap(g => g.permissions.map(p => p.id)));
    };


    const totalPermissions = useMemo(
        () => groups.reduce((sum, g) => sum + g.permissions.length, 0),
        [groups]
    );

    const allSelected = selectedIds.size === totalPermissions && totalPermissions > 0;
    const someSelected = selectedIds.size > 0 && !allSelected;

    const getGroupState = (group: PermissionGroup) => {
        const selected = group.permissions.filter(p => selectedIds.has(p.id)).length;
        return {
            all: selected === group.permissions.length && group.permissions.length > 0,
            some: selected > 0 && selected < group.permissions.length,
            count: selected,
        };
    };

    if (!groups.length) return null;

    return (
        <div className="w-full flex flex-col gap-2">

            {/* Select All */}
            <div className="flex items-center justify-between mb-3 px-1">
                <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={(e: CheckboxChangeEvent) => toggleAll(e.target.checked)}
                >
                    <AppText className='text-gray-700!'>Select All Permissions</AppText>
                </Checkbox>
                <Tag color={selectedIds.size > 0 ? 'blue' : 'default'}>
                    {selectedIds.size} / {totalPermissions} selected
                </Tag>
            </div>

            {/* Groups */}
            <Collapse
                defaultActiveKey={defaultOpenKeys}
                items={groups.map(group => {
                    const groupState = getGroupState(group);

                    return {
                        key: group.group,
                        label: (
                            <div
                                className="flex items-center gap-3"
                                onClick={e => e.stopPropagation()}
                            >
                                <Checkbox
                                    checked={groupState.all}
                                    indeterminate={groupState.some}
                                    onChange={(e: CheckboxChangeEvent) =>
                                        toggleGroup(group, e.target.checked)
                                    }
                                />
                                <span className="font-medium">
                                    {group.group.replace(/_/g, ' ')}
                                </span>
                                {groupState.count > 0 && (
                                    <Tag color="blue" className="text-xs">
                                        {groupState.count}/{group.permissions.length}
                                    </Tag>
                                )}
                            </div>
                        ),
                        children: (
                            <Row gutter={[12, 12]}>
                                {group.permissions.map(permission => (
                                    <Col xs={24} sm={8} key={permission.id}>
                                        <div className="flex items-start gap-2 p-3 transition-colors permission-card">
                                            <Checkbox
                                                checked={selectedIds.has(permission.id)}
                                                onChange={(e: CheckboxChangeEvent) =>
                                                    togglePermission(permission.id, e.target.checked)
                                                }
                                                className="mt-0.5"
                                            />
                                            <div className="flex flex-col min-w-0">
                                                <AppText className="text-sm! font-medium! text-gray-800! leading-tight!">
                                                    {permission.name.replace(/_/g, ' ')}
                                                </AppText>
                                                <AppText className='text-xs! text-gray-400! mt-0.5! leading-tight!'>{permission.description}</AppText>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        ),
                    };
                })}
            />
        </div>
    );
};

export default PermissionSelector;