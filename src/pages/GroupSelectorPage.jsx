import Sidebar from '../components/ui/Sidebar/Sidebar';
import Navbar from '../components/ui/Navbar/Navbar';
import Wrapper from '../components/ui/Wrapper/Wrapper';
import Group from '../components/ui/Group/Group';

import { useState } from 'react';

const GroupSelectorPage = () => {

    const [activeAction, setActiveAction] = useState('showall');

    return (
        <>
            <Sidebar/>
            <Wrapper>
                <Navbar 
                    title="Select a Group"
                    actions={[
                        {id: 'showall', label: 'Show all'},
                        {id: 'completed', label: 'Completed'},
                        {id: 'running', label: 'Running'}
                    ]}
                    activeAction={activeAction}
                    actionsDropdown={true}
                    onActionClick={setActiveAction}
                />

                <div className="p-10">
                    <Group
                        icon="👍"
                        title="My Group"
                        members={[{ name: 'Alice' }, { name: 'Bob' }]}
                        entryId="12345"
                        description="This is a sample group description."
                    />
                </div>
            </Wrapper>
        </>
    )
}

export default GroupSelectorPage;