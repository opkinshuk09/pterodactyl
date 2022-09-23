import React, { useState } from 'react';
import ConfirmationModal from '@/components/elements/ConfirmationModal';
import { ServerContext } from '@/state/server';
import { Subuser } from '@/state/server/subusers';
import deleteSubuser from '@/api/server/users/deleteSubuser';
import { Actions, useStoreActions } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { httpErrorToHuman } from '@/api/http';
import tw from 'twin.macro';
import { UserRemoveIcon } from '@heroicons/react/solid';

export default ({ subuser }: { subuser: Subuser }) => {
    const [loading, setLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const removeSubuser = ServerContext.useStoreActions((actions) => actions.subusers.removeSubuser);
    const { addError, clearFlashes } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const doDeletion = () => {
        setLoading(true);
        clearFlashes('users');
        deleteSubuser(uuid, subuser.uuid)
            .then(() => {
                setLoading(false);
                removeSubuser(subuser.uuid);
            })
            .catch((error) => {
                console.error(error);
                addError({ key: 'users', message: httpErrorToHuman(error) });
                setShowConfirmation(false);
            });
    };

    return (
        <>
            <ConfirmationModal
                title={'Delete this subuser?'}
                buttonText={'Yes, remove subuser'}
                visible={showConfirmation}
                showSpinnerOverlay={loading}
                onConfirmed={() => doDeletion()}
                onModalDismissed={() => setShowConfirmation(false)}
            >
                Are you sure you wish to remove this subuser? They will have all access to this server revoked
                immediately.
            </ConfirmationModal>
            <button
                type={'button'}
                aria-label={'Delete subuser'}
                css={tw`block text-sm p-2 text-zinc-600 hover:text-red-600 dark:(text-zinc-500 hover:text-red-400) transition-colors duration-150`}
                onClick={() => setShowConfirmation(true)}
            >
                <UserRemoveIcon css={tw`w-5 h-5`} />
            </button>
        </>
    );
};
