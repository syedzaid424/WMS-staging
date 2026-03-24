import type { FieldType } from "../../../../../../../components/dynamicForm";
import type { PermissionGroup, PermissionItem } from "../../../../../../../types/main/user"
import PermissionSelector from "../components/permissionSelector";

interface UseRoleMutationFormHook {
    permissionGroups: PermissionGroup[];
    editPermissions: PermissionItem[]
}

const useRoleMutationFormHook = ({ permissionGroups, editPermissions }: UseRoleMutationFormHook) => {
    return [
        {
            name: "name",
            label: "Role Name",
            type: "text" as FieldType,
            span: 8,
            placeholder: "e.g. Manager",
            inputClassName: "h-9",
        },
        {
            name: "permissionIds",
            label: "Permissions",
            type: "custom" as FieldType,
            span: 24,
            customComponent: (
                <PermissionSelector
                    groups={permissionGroups}
                    defaultValue={editPermissions}
                />
            ),
        },
    ]
}

export default useRoleMutationFormHook
