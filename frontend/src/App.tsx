import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AlertTicker } from './components/AlertTicker';
import { SMSModal } from './components/SMSModal';
import { SimulateFloodModal } from './components/SimulateFloodModal';

import { CitizenHome } from './pages/CitizenHome';
import { ReportDisaster } from './pages/ReportDisaster';
import { GovernmentDashboard } from './pages/GovernmentDashboard';
import { DisasterDetails } from './pages/DisasterDetails';
import { EmergencyTeamDashboard } from './pages/EmergencyTeamDashboard';
import { HospitalsPage } from './pages/HospitalsPage';
import { ResourcesPage } from './pages/ResourcesPage';

import { api } from './services/api';
import { Disaster, Hospital, RescueTeam, ResourceItem, Alert, SimulationResult } from './types';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('government');
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [rescueTeams, setRescueTeams] = useState<RescueTeam[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(null);

  // Modals & Simulation state
  const [isSMSModalOpen, setIsSMSModalOpen] = useState<boolean>(false);
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  // Fetch all initial data
  const refreshData = async () => {
    try {
      const [dList, hList, rList, resList, aList] = await Promise.all([
        api.getDisasters(),
        api.getHospitals(),
        api.getRescueTeams(),
        api.getResources(),
        api.getAlerts()
      ]);
      setDisasters(dList);
      setHospitals(hList);
      setRescueTeams(rList);
      setResources(resList);
      setAlerts(aList);
      if (dList.length > 0 && !selectedDisaster) {
        setSelectedDisaster(dList[0]);
      }
    } catch (e) {
      console.warn('Initial data load completed with default/partial response');
    }
  };

  useEffect(() => {
    refreshData();
    // Auto-poll alerts every 12 seconds
    const interval = setInterval(async () => {
      try {
        const latestAlerts = await api.getAlerts();
        if (latestAlerts.length > 0) setAlerts(latestAlerts);
      } catch (e) {}
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // One-Click "Simulate Flood Emergency" Handler
  const handleTriggerSimulation = async () => {
    setIsSimulating(true);
    setIsSimulateModalOpen(true);
    setSimulationResult(null);

    try {
      const res = await api.simulateFlood();
      setSimulationResult(res);
      // Refresh disaster lists
      await refreshData();
      if (res.disaster) {
        setSelectedDisaster({
          ...res.disaster,
          response_plan: res.response_plan
        });
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleNavigateToDisaster = (disasterId: number) => {
    const found = disasters.find(d => d.id === disasterId);
    if (found) {
      setSelectedDisaster(found);
      setCurrentTab('details');
    } else {
      api.getDisaster(disasterId).then(d => {
        if (d) {
          setSelectedDisaster(d);
          setCurrentTab('details');
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-rose-600 selection:text-white">
      {/* Official Government Top Bar & Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onTriggerSimulation={handleTriggerSimulation}
        isSimulating={isSimulating}
      />

      {/* Live Emergency Alert Ticker */}
      <AlertTicker
        alerts={alerts}
        onOpenSMSModal={() => setIsSMSModalOpen(true)}
      />

      {/* Main Page Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {currentTab === 'citizen' && (
          <CitizenHome
            onGoToReport={() => setCurrentTab('report')}
            onGoToDashboard={() => setCurrentTab('government')}
            disasters={disasters}
            onTriggerSimulation={handleTriggerSimulation}
          />
        )}

        {currentTab === 'report' && (
          <ReportDisaster
            onSuccess={(disasterId) => {
              refreshData();
              handleNavigateToDisaster(disasterId);
            }}
            onCancel={() => setCurrentTab('citizen')}
          />
        )}

        {currentTab === 'government' && (
          <GovernmentDashboard
            disasters={disasters}
            hospitals={hospitals}
            rescueTeams={rescueTeams}
            alerts={alerts}
            onSelectDisaster={(d) => {
              setSelectedDisaster(d);
              setCurrentTab('details');
            }}
            onOpenSMSModal={() => setIsSMSModalOpen(true)}
            onTriggerSimulation={handleTriggerSimulation}
          />
        )}

        {currentTab === 'details' && selectedDisaster && (
          <DisasterDetails
            disaster={selectedDisaster}
            onBack={() => setCurrentTab('government')}
            onRefreshDisaster={(updated) => {
              setSelectedDisaster(updated);
              refreshData();
            }}
            onOpenSMSModal={() => setIsSMSModalOpen(true)}
          />
        )}

        {currentTab === 'emergency_team' && (
          <EmergencyTeamDashboard
            rescueTeams={rescueTeams}
            disasters={disasters}
            onSelectDisaster={(d) => {
              setSelectedDisaster(d);
              setCurrentTab('details');
            }}
          />
        )}

        {currentTab === 'hospitals' && (
          <HospitalsPage hospitals={hospitals} />
        )}

        {currentTab === 'resources' && (
          <ResourcesPage resources={resources} />
        )}
      </main>

      {/* Cellular SMS Broadcast Modal */}
      <SMSModal
        isOpen={isSMSModalOpen}
        onClose={() => setIsSMSModalOpen(false)}
        disasterText={selectedDisaster?.response_plan?.sms_broadcast_text}
      />

      {/* 14-Step "Simulate Flood Emergency" Modal */}
      <SimulateFloodModal
        isOpen={isSimulateModalOpen}
        onClose={() => setIsSimulateModalOpen(false)}
        onSimulationComplete={(res) => {
          setSimulationResult(res);
          refreshData();
        }}
        onViewDetails={(id) => handleNavigateToDisaster(id)}
        simulationResult={simulationResult}
        isRunning={isSimulating}
      />

      {/* Official Government Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">DisasterGuard AI</span>
            <span>•</span>
            <span>Smart India Hackathon (SIH 2026) Official Project Submission</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>NDMA Emergency Helpline: 1078</span>
            <span>•</span>
            <span>Civil Defense: 112</span>
            <span>•</span>
            <span className="text-emerald-500 font-mono">SYSTEM: NOMINAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
