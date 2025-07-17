import './App.css'
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Button from './components/ui/Button/Button.jsx';
import Input from './components/ui/Input/Input.jsx';
import { Group } from './components/ui/Group/Group.jsx';
import { BeakerIcon, EnvelopeIcon, KeyIcon } from '@heroicons/react/24/outline'
import Sidebar from './components/ui/Sidebar/Sidebar.jsx';
import Navbar from './components/ui/Navbar/Navbar.jsx';
import Wrapper from './components/ui/Wrapper/Wrapper.jsx';
import Warning from './components/ui/Warning/Warning.jsx';
import Header from './components/ui/Header/Header.jsx';
import Movement from './components/ui/Movement/Movement.jsx';
import Participant from './components/ui/Participant/Participant.jsx';

function App() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeAction, setActiveAction] = useState('action1');

  return (
    <>
      <Sidebar/>
      <Wrapper>
        <Navbar 
          title="My Application"
          actions={[
            { id: 'action1', label: 'Action 1' },
            { id: 'action2', label: 'Action 2' }
          ]}
          activeAction={activeAction}
          actionsDropdown={true}
          onActionClick={setActiveAction}
        />
        <Router>
          <Routes>
            <Route path="/" element={
              <div className="App flex justify-center items-center min-h-100">
                <div className="flex flex-col w-full justify-center">
                  <div className="m-4">
                    <Warning
                      message="This is a warning message!"
                      icon="⚠️">
                    </Warning>
                  </div>

                  <div className="m-4">
                    <Participant
                      participantId="1"
                      participantName="John Doe"
                      src="https://placehold.co/32x32/orange/white"
                      netBalance={1000}
                      currency="USD"
                    />
                  </div>

                  <div className="m-4">
                      <Group
                        icon="👍"
                        title="My Group"
                        members={[{ name: 'Alice' }, { name: 'Bob' }]}
                        entryId="12345"
                        description="This is a sample group description."
                      />
                  </div>

                  <div className="m-4">
                    <Header 
                      title="Welcome to My Application"
                      description="This is a sample subtitle for the application."
                      membersCount={3}
                      icon="🌟"
                    />
                  </div>

                  <div className="m-4">
                    <Movement
                      type="deposit"
                      amount={1000}
                      title="Salary"
                      description="Monthly salary deposit"
                      commentsAmount={5}
                      movementId="1"
                      owner="John Doe"
                      members={[
                        { name: 'John Doe', src: "https://placehold.co/32x32/orange/white" },
                        { name: 'Jane Smith', src: "https://placehold.co/32x32/blue/white"},
                        { name: 'Alice Johnson', src: "https://placehold.co/32x32/green/white" },
                        { name: 'Bob Brown', src: "https://placehold.co/32x32/red/white" }
                      ]}
                    />
                  </div>

                  <form className="flex flex-col gap-2 mt-4 w-fit">
                      <Input
                          type="email"
                          label="Email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          icon={<EnvelopeIcon className="w-6"/>}
                      />

                      <Input
                          type="password"
                          label="Password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          icon={<KeyIcon className="w-6"/>}
                      />

                      <div className="mt-4">
                        <Button 
                          text="My favorite text ever"
                          size="full"
                          textVisibility={true}
                          iconVisibility={true}
                          icon={<BeakerIcon className="w-6" />}
                          onClick={() => alert('Button clicked!')}
                          style="fill"
                        /> 
                      </div>
                  </form>
                </div>
              </div>
            } />
            {/* Add a route for the group detail page */}
            <Route path="/group/:entryId" element={<div>Group Detail Page</div>} />
          </Routes>
        </Router>
      </Wrapper>
    </>
  )
}

export default App
