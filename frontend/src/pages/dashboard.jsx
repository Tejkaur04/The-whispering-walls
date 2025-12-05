import React, { useState, useEffect } from 'react';
import { Activity, Home, AlertCircle, BarChart3, Sun, Moon, RefreshCw, ChevronRight } from 'lucide-react';

const WhisperingWallsDashboard = () => {
  const [isDark, setIsDark] = useState(true);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [activeView, setActiveView] = useState('overview');

  const generateSensorData = () => {
    const floors = [
      { id: 1, name: 'Floor 1', sensors: 8, zone: 'Lobby' },
      { id: 2, name: 'Floor 2', sensors: 12, zone: 'Offices' },
      { id: 3, name: 'Floor 3', sensors: 10, zone: 'Labs' },
      { id: 4, name: 'Floor 4', sensors: 6, zone: 'Executive' }
    ];

    return floors.map(floor => {
      const sensors = Array.from({ length: floor.sensors }, (_, i) => {
        const baseTemp = 68 + floor.id * 0.5;
        const temp = baseTemp + Math.random() * 10;
        const isCritical = Math.random() > 0.87;
        const isWarning = !isCritical && Math.random() > 0.82;
        
        return {
          id: `${floor.id}-${i + 1}`,
          name: `HVAC-${floor.id}${String(i + 1).padStart(2, '0')}`,
          location: `Zone ${String.fromCharCode(65 + Math.floor(i / 3))}`,
          temperature: temp,
          status: isCritical ? 'critical' : isWarning ? 'warning' : 'normal',
          lastReading: Math.floor(Math.random() * 120) + 1
        };
      });

      const criticalCount = sensors.filter(s => s.status === 'critical').length;
      const warningCount = sensors.filter(s => s.status === 'warning').length;

      return {
        ...floor,
        sensors,
        criticalCount,
        warningCount,
        status: criticalCount > 0 ? 'critical' : warningCount > 0 ? 'warning' : 'normal',
        avgTemp: sensors.reduce((sum, s) => sum + s.temperature, 0) / sensors.length
      };
    });
  };

  const [buildingData, setBuildingData] = useState(generateSensorData());

  useEffect(() => {
    const interval = setInterval(() => {
      setBuildingData(prev => prev.map(floor => ({
        ...floor,
        sensors: floor.sensors.map(sensor => {
          if (Math.random() > 0.7) {
            const newTemp = sensor.temperature + (Math.random() - 0.5) * 1.2;
            const newStatus = newTemp > 75 ? 'critical' : newTemp > 72 ? 'warning' : 'normal';
            
            return {
              ...sensor,
              temperature: newTemp,
              status: newStatus,
              lastReading: Math.floor(Math.random() * 120) + 1
            };
          }
          return sensor;
        })
      })));
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    if (status === 'critical') return '#ef4444';
    if (status === 'warning') return '#f59e0b';
    return '#10b981';
  };

  const totalSensors = buildingData.reduce((sum, f) => sum + f.sensors.length, 0);
  const totalCritical = buildingData.reduce((sum, f) => sum + f.criticalCount, 0);
  const totalWarning = buildingData.reduce((sum, f) => sum + f.warningCount, 0);

  const theme = {
    bg: isDark ? '#0f172a' : '#f8fafc',
    cardBg: isDark ? '#1e293b' : '#ffffff',
    text: isDark ? '#f1f5f9' : '#1e293b',
    textSecondary: isDark ? '#94a3b8' : '#64748b',
    border: isDark ? '#334155' : '#e2e8f0',
    hover: isDark ? '#2d3748' : '#f1f5f9'
  };

  const NavButton = ({ icon: Icon, label, active, onClick }) => (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 16px',
        backgroundColor: active ? (isDark ? '#3b82f6' : '#3b82f6') : 'transparent',
        color: active ? '#ffffff' : theme.text,
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
        transition: 'all 0.2s',
        width: '100%',
        textAlign: 'left'
      }}
      onMouseEnter={e => {
        if (!active) e.currentTarget.style.backgroundColor = theme.hover;
      }}
      onMouseLeave={e => {
        if (!active) e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.bg,
      color: theme.text,
      fontFamily: "'Inter', -apple-system, sans-serif",
      display: 'flex',
      transition: 'background-color 0.3s'
    }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        backgroundColor: theme.cardBg,
        borderRight: `1px solid ${theme.border}`,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px'
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '32px'
        }}>
          <Activity size={24} style={{ color: '#3b82f6' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '16px' }}>Whispering Walls</div>
            <div style={{ fontSize: '11px', color: theme.textSecondary }}>Live Monitor</div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '32px' }}>
          <NavButton 
            icon={Home} 
            label="Overview" 
            active={activeView === 'overview'}
            onClick={() => {
              setActiveView('overview');
              setSelectedFloor(null);
            }}
          />
          <NavButton 
            icon={BarChart3} 
            label="Floor Details" 
            active={activeView === 'floors'}
            onClick={() => setActiveView('floors')}
          />
          <NavButton 
            icon={AlertCircle} 
            label="Active Alerts" 
            active={activeView === 'alerts'}
            onClick={() => setActiveView('alerts')}
          />
        </nav>

        {/* Quick Stats */}
        <div style={{
          backgroundColor: isDark ? '#0f172a' : '#f8fafc',
          borderRadius: '12px',
          padding: '16px',
          marginTop: 'auto'
        }}>
          <div style={{ fontSize: '12px', color: theme.textSecondary, marginBottom: '12px' }}>
            System Status
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span>Total Sensors</span>
              <span style={{ fontWeight: 600 }}>{totalSensors}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span>Critical</span>
              <span style={{ fontWeight: 600, color: getStatusColor('critical') }}>{totalCritical}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span>Warnings</span>
              <span style={{ fontWeight: 600, color: getStatusColor('warning') }}>{totalWarning}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{
          backgroundColor: theme.cardBg,
          borderBottom: `1px solid ${theme.border}`,
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
              {activeView === 'overview' ? 'Building Overview' : 
               activeView === 'floors' ? 'Floor Management' : 'Active Alerts'}
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: theme.textSecondary }}>
              Last updated {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setBuildingData(generateSensorData())}
              style={{
                padding: '8px 12px',
                backgroundColor: 'transparent',
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                color: theme.text,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.hover}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <RefreshCw size={14} />
              Refresh
            </button>
            <button
              onClick={() => setIsDark(!isDark)}
              style={{
                padding: '8px 12px',
                backgroundColor: 'transparent',
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                color: theme.text,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.hover}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {/* Overview View */}
          {activeView === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Status Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px'
              }}>
                {buildingData.map(floor => (
                  <div
                    key={floor.id}
                    onClick={() => {
                      setSelectedFloor(floor.id);
                      setActiveView('floors');
                    }}
                    style={{
                      backgroundColor: theme.cardBg,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '12px',
                      padding: '20px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      borderLeft: `4px solid ${getStatusColor(floor.status)}`
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `0 4px 12px ${getStatusColor(floor.status)}20`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{floor.name}</h3>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: theme.textSecondary }}>
                          {floor.zone}
                        </p>
                      </div>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: `${getStatusColor(floor.status)}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px'
                      }}>
                        {floor.status === 'critical' ? '⚠' : floor.status === 'warning' ? '!' : '✓'}
                      </div>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
                      {floor.avgTemp.toFixed(1)}°F
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: theme.textSecondary }}>
                      <span>{floor.sensors.length} sensors</span>
                      <span style={{ color: getStatusColor(floor.status), fontWeight: 600 }}>
                        {floor.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Floor Details View */}
          {activeView === 'floors' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Floor Selection */}
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                {buildingData.map(floor => (
                  <button
                    key={floor.id}
                    onClick={() => setSelectedFloor(floor.id)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: selectedFloor === floor.id ? '#3b82f6' : theme.cardBg,
                      color: selectedFloor === floor.id ? '#ffffff' : theme.text,
                      border: `1px solid ${selectedFloor === floor.id ? '#3b82f6' : theme.border}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 500,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                      if (selectedFloor !== floor.id) {
                        e.currentTarget.style.backgroundColor = theme.hover;
                      }
                    }}
                    onMouseLeave={e => {
                      if (selectedFloor !== floor.id) {
                        e.currentTarget.style.backgroundColor = theme.cardBg;
                      }
                    }}
                  >
                    {floor.name} ({floor.sensors.length})
                  </button>
                ))}
              </div>

              {/* Selected Floor Details */}
              {selectedFloor && (() => {
                const floor = buildingData.find(f => f.id === selectedFloor);
                return (
                  <div style={{
                    backgroundColor: theme.cardBg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '12px',
                    padding: '24px'
                  }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600 }}>
                      {floor.name} - Sensor Details
                    </h3>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: theme.textSecondary }}>SENSOR</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: theme.textSecondary }}>LOCATION</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: theme.textSecondary }}>TEMPERATURE</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: theme.textSecondary }}>STATUS</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: theme.textSecondary }}>UPDATED</th>
                          </tr>
                        </thead>
                        <tbody>
                          {floor.sensors.map(sensor => (
                            <tr key={sensor.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                              <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '13px' }}>
                                {sensor.name}
                              </td>
                              <td style={{ padding: '12px', fontSize: '13px', color: theme.textSecondary }}>
                                {sensor.location}
                              </td>
                              <td style={{ padding: '12px', fontSize: '15px', fontWeight: 600 }}>
                                {sensor.temperature.toFixed(1)}°F
                              </td>
                              <td style={{ padding: '12px' }}>
                                <span style={{
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  backgroundColor: `${getStatusColor(sensor.status)}20`,
                                  color: getStatusColor(sensor.status)
                                }}>
                                  {sensor.status.toUpperCase()}
                                </span>
                              </td>
                              <td style={{ padding: '12px', fontSize: '12px', color: theme.textSecondary }}>
                                {sensor.lastReading}s ago
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Alerts View */}
          {activeView === 'alerts' && (
            <div style={{
              backgroundColor: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '12px',
              padding: '24px'
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600 }}>
                Active Alerts
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {buildingData.flatMap(floor => 
                  floor.sensors
                    .filter(s => s.status !== 'normal')
                    .map(sensor => (
                      <div
                        key={sensor.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          padding: '16px',
                          backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                          borderRadius: '8px',
                          borderLeft: `4px solid ${getStatusColor(sensor.status)}`
                        }}
                      >
                        <AlertCircle size={20} style={{ color: getStatusColor(sensor.status) }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>
                            {sensor.name} - {floor.name}
                          </div>
                          <div style={{ fontSize: '12px', color: theme.textSecondary }}>
                            {sensor.location} • {sensor.temperature.toFixed(1)}°F
                          </div>
                        </div>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: `${getStatusColor(sensor.status)}20`,
                          color: getStatusColor(sensor.status)
                        }}>
                          {sensor.status.toUpperCase()}
                        </span>
                      </div>
                    ))
                )}
                {buildingData.every(floor => floor.sensors.every(s => s.status === 'normal')) && (
                  <div style={{ textAlign: 'center', padding: '40px', color: theme.textSecondary }}>
                    No active alerts - all systems normal
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default WhisperingWallsDashboard;