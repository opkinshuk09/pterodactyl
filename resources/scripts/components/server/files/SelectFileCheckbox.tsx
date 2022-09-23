import React from 'react';
import tw from 'twin.macro';
import { ServerContext } from '@/state/server';
import styled from 'styled-components';
import Input from '@/components/elements/Input';

export const FileActionCheckbox = styled(Input)`
    && {
        ${tw`border-zinc-700 dark:border-zinc-500 bg-transparent`};

        &:not(:checked) {
            ${tw`hover:(border-zinc-400 dark:border-zinc-300)`};
        }
    }
`;

export default ({ name }: { name: string }) => {
    const isChecked = ServerContext.useStoreState((state) => state.files.selectedFiles.indexOf(name) >= 0);
    const appendSelectedFile = ServerContext.useStoreActions((actions) => actions.files.appendSelectedFile);
    const removeSelectedFile = ServerContext.useStoreActions((actions) => actions.files.removeSelectedFile);

    return (
        <label css={tw`flex-none px-4 py-2 self-center cursor-pointer`}>
            <FileActionCheckbox
                name={'selectedFiles'}
                value={name}
                checked={isChecked}
                type={'checkbox'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.currentTarget.checked) {
                        appendSelectedFile(name);
                    } else {
                        removeSelectedFile(name);
                    }
                }}
            />
        </label>
    );
};
