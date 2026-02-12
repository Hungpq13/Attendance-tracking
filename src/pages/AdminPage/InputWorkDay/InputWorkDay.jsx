import { useState, useEffect, useRef } from 'react';
import './InputWorkDay.css';
import { userAPI, payrollAPI } from '../../../services/api';

function InputWorkDay() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // Calculate previous month
  let previousMonth = currentMonth - 1;
  let previousYear = currentYear;
  if (previousMonth === 0) {
    previousMonth = 12;
    previousYear = currentYear - 1;
  }

  const [selectedYear, setSelectedYear] = useState(previousYear);
  const [selectedMonth, setSelectedMonth] = useState(previousMonth);
  
  const monthLabel = new Date(selectedYear, selectedMonth - 1).toLocaleString("vi-VN", {
    month: "long",
    year: "numeric",
  });

  // Generate year options (from 2020 to current year)
  const startYear = 2020;
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => startYear + i,
  );

  // Months array
  const months = [
    { value: 1, label: "Tháng 1" },
    { value: 2, label: "Tháng 2" },
    { value: 3, label: "Tháng 3" },
    { value: 4, label: "Tháng 4" },
    { value: 5, label: "Tháng 5" },
    { value: 6, label: "Tháng 6" },
    { value: 7, label: "Tháng 7" },
    { value: 8, label: "Tháng 8" },
    { value: 9, label: "Tháng 9" },
    { value: 10, label: "Tháng 10" },
    { value: 11, label: "Tháng 11" },
    { value: 12, label: "Tháng 12" },
  ];

  // Check if selected month matches previous month
  const isValidSelection = selectedYear === previousYear && selectedMonth === previousMonth;

  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState(() => {
    // Load from localStorage on initial render
    const saved = localStorage.getItem('selectedUserIds');
    return saved ? JSON.parse(saved) : [];
  });
  const [showModal, setShowModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null); // Currently editing in modal
  const [searchInput, setSearchInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const searchInputRef = useRef(null);
  
  // Fetch users from API
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const employeeList = await userAPI.getAllUsers();
        // Filter users with fullName != null
        const filteredUsers = employeeList
          .filter(emp => emp.fullName && emp.fullName.trim() !== "")
          .map(emp => ({
            id: emp.id,
            fullName: emp.fullName,
            username: emp.username || emp.email || `ID: ${emp.id}`,
          }));
        setUsers(filteredUsers);
      } catch (error) {
        // Error fetching users
      }
    };

    loadUsers();
  }, []);

  // Save selectedUserIds to localStorage
  useEffect(() => {
    localStorage.setItem('selectedUserIds', JSON.stringify(selectedUserIds));
  }, [selectedUserIds]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.id !== 'userSearch' && 
          !e.target.closest('.dropdown-list') &&
          !e.target.closest('.note-dropdown-wrapper') &&
          !e.target.closest('.note-input-container')) {
        setShowDropdown(false);
        // Close all note dropdowns
        setNoteDropdownOpen({});
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Update dropdown position when it's shown or window is resized
  useEffect(() => {
    if (showDropdown && searchInputRef.current) {
      const rect = searchInputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom,
        left: rect.left,
      });
    }
  }, [showDropdown]);

  // Update position on scroll
  useEffect(() => {
    if (!showDropdown) return;

    const handleScroll = () => {
      if (searchInputRef.current) {
        const rect = searchInputRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom,
          left: rect.left,
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showDropdown]);
  
  const [timesheetData, setTimesheetData] = useState({});
  const [noteDropdownOpen, setNoteDropdownOpen] = useState({});
  const [noteInputMode, setNoteInputMode] = useState({});
  const [salaryData, setSalaryData] = useState(() => {
    // Load from localStorage on initial render
    try {
      const saved = localStorage.getItem('salaryData');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Error loading salaryData from localStorage:', error);
      return {};
    }
  });

  // Save salaryData to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('salaryData', JSON.stringify(salaryData));
    } catch (error) {
      console.error('Error saving salaryData to localStorage:', error);
    }
  }, [salaryData]);

  // Note options
  const noteOptions = [
    { value: 'Tăng ca', label: 'Tăng ca' },
    { value: 'Tăng ca full', label: 'Tăng ca full' },
    { value: 'Tăng ca tối', label: 'Tăng ca tối' },
    { value: 'khác', label: 'Khác' },
  ];

  // Salary components
  const salaryComponents = [
    { id: 1, label: 'Lương ngày công', code: 'DAILY_BASE' },
    { id: 2, label: 'Phụ cấp nhà trọ', code: 'HOUSING' },
    { id: 3, label: 'Phụ cấp xăng xe', code: 'PETROL' },
    { id: 4, label: 'Phụ cấp điện thoại', code: 'PHONE' },
  ];

  // Get current user's timesheet data for the month
  const getMonthDays = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const currentMonthDays = getMonthDays(selectedYear, selectedMonth);
  const currentTimesheetData = timesheetData[editingUserId] || {};

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    setShowDropdown(true);
  };

  const handleSelectUser = (user) => {
    // Check if user already selected
    if (selectedUserIds.includes(user.id)) {
      // If already selected, just open modal to edit
      setEditingUserId(user.id);
      setShowModal(true);
      setShowDropdown(false);
      return;
    }

    // Initialize timesheet data for new user if doesn't exist
    if (!timesheetData[user.id]) {
      const daysInMonth = getMonthDays(selectedYear, selectedMonth);
      const monthData = {};
      
      for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        monthData[dateKey] = {
          standardWorkDays: 1,
          overtimeHours: 0,
          note: ''
        };
      }
      
      setTimesheetData({
        ...timesheetData,
        [user.id]: monthData,
      });
    }

    // Initialize salary data for new user if doesn't exist
    if (!salaryData[user.id]) {
      setSalaryData({
        ...salaryData,
        [user.id]: {}
      });
    }
    
    // Add user to selected list
    setSelectedUserIds([...selectedUserIds, user.id]);
    
    // Open modal for editing
    setEditingUserId(user.id);
    setShowModal(true);
    
    // Clear search but keep dropdown visible for next selection
    setSearchInput('');
  };

  const handleTimesheetChange = (dateKey, field, value) => {
    const numValue = field === 'note' ? value : (parseFloat(value) || 0);
    
    setTimesheetData({
      ...timesheetData,
      [editingUserId]: {
        ...currentTimesheetData,
        [dateKey]: {
          ...currentTimesheetData[dateKey],
          [field]: numValue,
        },
      },
    });
  };

  const handleSave = async () => {
    if (!editingUserId) {
      alert("Vui lòng chọn nhân viên!");
      return;
    }

    try {
      const daysInMonth = getMonthDays(selectedYear, selectedMonth);
      let successCount = 0;
      let failureCount = 0;
      const errors = [];

      // Save each day's timesheet entry
      for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayData = currentTimesheetData[dateKey] || {
          standardWorkDays: 0,
          overtimeHours: 0,
          note: ''
        };

        // Skip if standardWorkDays is 0
        if (!dayData.standardWorkDays || dayData.standardWorkDays === 0) {
          continue;
        }

        // Check if date is in the future
        const dateObj = new Date(selectedYear, selectedMonth - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dateObj > today) {
          continue; // Skip future dates
        }

        const payload = {
          id: editingUserId,
          workDate: dateKey,
          standardWorkDays: dayData.standardWorkDays,
          overtimeHours: dayData.overtimeHours || 0,
          note: dayData.note || ''
        };

        try {
          await payrollAPI.saveTimesheet(payload);
          successCount++;
        } catch (error) {
          failureCount++;
          const errorMsg = error?.message || JSON.stringify(error) || 'Lỗi không xác định';
          errors.push({
            date: dateKey,
            payload: payload,
            error: errorMsg
          });
          console.error(`[Timesheet Save Error] Date: ${dateKey}`, {
            payload,
            error,
            errorMsg
          });
        }
      }

      // Save salary components
      let salarySaveCount = 0;
      let salaryFailCount = 0;
      const salaryErrors = [];

      const employeeUserData = salaryData[editingUserId] || {};
      
      for (const component of salaryComponents) {
        const componentAmount = employeeUserData[component.id];
        
        // Only save if amount has a value
        if (componentAmount && componentAmount !== '') {
          const salaryPayload = {
            id: editingUserId,
            componentCode: component.code,
            amount: parseFloat(componentAmount)
          };

          try {
            await payrollAPI.saveSalaryComponent(salaryPayload);
            salarySaveCount++;
            console.log(`[Salary Save Success] Component: ${component.label}`, salaryPayload);
          } catch (error) {
            salaryFailCount++;
            const errorMsg = error?.message || JSON.stringify(error) || 'Lỗi không xác định';
            salaryErrors.push({
              component: component.label,
              payload: salaryPayload,
              error: errorMsg
            });
            console.error(`[Salary Save Error] Component: ${component.label}`, {
              payload: salaryPayload,
              error,
              errorMsg
            });
          }
        }
      }

      // Show combined results
      let message = '';
      const hasSuccessfulSaves = successCount > 0 || salarySaveCount > 0;
      const hasFailures = failureCount > 0 || salaryFailCount > 0;
      
      if (hasSuccessfulSaves && !hasFailures) {
        // All saves successful
        message = 'Cập nhật thành công';
        alert(message);
        // Close modal after success
        setShowModal(false);
      } else if (hasSuccessfulSaves && hasFailures) {
        // Some saves succeeded, some failed
        if (successCount > 0) {
          message += `Lưu thành công: ${successCount} dòng công`;
        }
        
        if (salarySaveCount > 0) {
          message += (message ? ', ' : '') + `${salarySaveCount} khoản lương`;
        }
        
        if (failureCount > 0) {
          message += `\nLưu thất bại: ${failureCount} dòng công`;
        }

        if (salaryFailCount > 0) {
          message += (failureCount > 0 ? ', ' : '\nLưu thất bại: ') + `${salaryFailCount} khoản lương`;
        }
        
        alert(message);
      } else if (hasFailures) {
        // All saves failed
        if (failureCount > 0) {
          message += `Lưu thất bại: ${failureCount} dòng công`;
        }

        if (salaryFailCount > 0) {
          message += (failureCount > 0 ? ', ' : '') + `${salaryFailCount} khoản lương`;
        }
        
        alert(message);
      } else {
        // No data to save
        alert("Không có dữ liệu để lưu!");
      }

      if (failureCount > 0 || salaryFailCount > 0) {
        console.warn('Some saves failed', { errors, salaryErrors });
      }
    } catch (error) {
      console.error('[Timesheet Save Fatal Error]', error);
      alert("Lỗi khi lưu dữ liệu!");
    }
  };

  const selectedUser = users.find(u => u.id === editingUserId);
  
  // Filter users based on search input
  const filteredUsers = searchInput.trim() === '' ? 
    users : 
    users.filter(user => 
      user.fullName.toLowerCase().includes(searchInput.toLowerCase()) ||
      user.username.toLowerCase().includes(searchInput.toLowerCase())
    ).slice(0, 8); // Limit to 8 results

  return (
    <div className="page-container main-layout">
      <h2>Nhập ngày công tháng {monthLabel}</h2>

      <div className="month-selector">
        <div className="selector-group">
          <label htmlFor="yearSelect">Năm: </label>
          <select 
            id="yearSelect"
            value={selectedYear}
            onChange={(e) => {
              const newYear = parseInt(e.target.value);
              if (newYear === previousYear && selectedMonth === previousMonth) {
                setSelectedYear(newYear);
              } else {
                alert(`Chỉ được nhập dữ liệu cho tháng ${previousMonth} năm ${previousYear}`);
              }
            }}
            disabled={selectedMonth !== previousMonth}
          >
            {years.map((year) => (
              <option key={year} value={year} disabled={year !== previousYear}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="selector-group">
          <label htmlFor="monthSelect">Tháng: </label>
          <select 
            id="monthSelect"
            value={selectedMonth}
            onChange={(e) => {
              const newMonth = parseInt(e.target.value);
              if (newMonth === previousMonth && selectedYear === previousYear) {
                setSelectedMonth(newMonth);
              } else {
                alert(`Chỉ được nhập dữ liệu cho tháng ${previousMonth} năm ${previousYear}`);
              }
            }}
          >
            {months.map((month) => (
              <option key={month.value} value={month.value} disabled={month.value !== previousMonth}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
        {!isValidSelection && (
          <div className="selector-warning">
            ⚠️ Chỉ được nhập dữ liệu cho tháng {previousMonth} năm {previousYear}
          </div>
        )}
        <div className="selector-group">
          <label htmlFor="userSearch">Chọn nhân viên: </label>
          <div className="search-wrapper">
            <input
              ref={searchInputRef}
              id="userSearch"
              type="text"
              placeholder="Nhập tên nhân viên..."
              value={searchInput}
              onChange={handleSearchChange}
              onFocus={() => setShowDropdown(true)}
              className="search-input"
            />
            {showDropdown && (
              <div 
                className="dropdown-list"
                style={{
                  top: `${dropdownPosition.top}px`,
                  left: `${dropdownPosition.left}px`,
                  width: '220px',
                }}
              >
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`dropdown-item ${selectedUserIds.includes(user.id) ? 'active' : ''}`}
                      onClick={() => handleSelectUser(user)}
                      title={user.username}
                    >
                      <div className="item-name">{user.fullName}</div>
                      <div className="item-username">{user.username}</div>
                    </div>
                  ))
                ) : (
                  <div className="dropdown-empty">Không tìm thấy nhân viên</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {editingUserId && selectedUser && showModal && (
        <div className="modal-overlay">
          <div className="modal-content-wrapper">
            <div className="modal-header">
              <h3>Nhập công cho: <strong>{selectedUser.fullName}</strong> ({selectedUser.username})</h3>
              <button 
                className="modal-close-button"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div style={{ overflowX: 'auto' }}>
                <table className="workday-table input-table">
                  <thead>
                    <tr>
                      <th>Ngày công</th>
                      <th>Công chuẩn</th>
                      <th>Tăng ca (giờ)</th>
                      <th>Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: currentMonthDays }, (_, i) => {
                      const day = i + 1;
                      const dateKey = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const dayData = currentTimesheetData[dateKey] || {
                        standardWorkDays: 1,
                        overtimeHours: 0,
                        note: ''
                      };
                      
                      const dateObj = new Date(selectedYear, selectedMonth - 1, day);
                      const dateStr = dateObj.toLocaleDateString('vi-VN', {
                        weekday: 'short',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      });

                      // Check if date is in the future
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const isFutureDate = dateObj > today;

                      return (
                        <tr key={dateKey} className={`${i % 2 === 0 ? 'even-row' : 'odd-row'} ${isFutureDate ? 'disabled-row' : ''}`}>
                          <td className="date-cell">{dateStr}</td>
                          <td className="center-cell">
                            <input
                              type="number"
                              value={dayData.standardWorkDays || 1}
                              onChange={(e) => handleTimesheetChange(dateKey, 'standardWorkDays', e.target.value)}
                              min="0"
                              max="1"
                              step="0.5"
                              className="input-field"
                              disabled={isFutureDate || !isValidSelection}
                            />
                          </td>
                          <td className="center-cell">
                            <input
                              type="number"
                              value={dayData.overtimeHours || 0}
                              onChange={(e) => handleTimesheetChange(dateKey, 'overtimeHours', e.target.value)}
                              min="0"
                              step="0.5"
                              className="input-field"
                              disabled={isFutureDate || !isValidSelection}
                            />
                          </td>
                          <td className="note-cell">
                            {noteInputMode[dateKey] ? (
                              <div className="note-input-container">
                                <input
                                  type="text"
                                  value={dayData.note || ''}
                                  onChange={(e) => handleTimesheetChange(dateKey, 'note', e.target.value)}
                                  placeholder="Nhập ghi chú..."
                                  className="input-field custom-note-input"
                                  autoFocus
                                  disabled={isFutureDate || !isValidSelection}
                                />
                                <button
                                  className="note-back-button"
                                  onClick={() => setNoteInputMode({
                                    ...noteInputMode,
                                    [dateKey]: false
                                  })}
                                  disabled={isFutureDate || !isValidSelection}
                                >
                                  ←
                                </button>
                              </div>
                            ) : (
                              <div className="note-dropdown-wrapper">
                                <button
                                  className="note-dropdown-button"
                                  onClick={() => setNoteDropdownOpen({
                                    ...noteDropdownOpen,
                                    [dateKey]: !noteDropdownOpen[dateKey]
                                  })}
                                  disabled={isFutureDate || !isValidSelection}
                                >
                                  {dayData.note || 'Chọn ghi chú...'}
                                </button>
                                {noteDropdownOpen[dateKey] && !isFutureDate && (
                                  <div className="note-dropdown-menu">
                                    {noteOptions.map((option) => (
                                      <div
                                        key={option.value}
                                        className="note-option"
                                        onClick={() => {
                                          if (option.value === 'khác') {
                                            handleTimesheetChange(dateKey, 'note', '');
                                            setNoteInputMode({
                                              ...noteInputMode,
                                              [dateKey]: true
                                            });
                                          } else {
                                            handleTimesheetChange(dateKey, 'note', option.value);
                                          }
                                          setNoteDropdownOpen({
                                            ...noteDropdownOpen,
                                            [dateKey]: false
                                          });
                                        }}
                                      >
                                        {option.label}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="salary-section">
              <h4 className="salary-section-title">Tiền phải trả</h4>
              <div className="salary-inputs-grid">
                {salaryComponents.map((component) => {
                  const currentValue = (salaryData[editingUserId] || {})[component.id] || '';
                  return (
                    <div key={component.id} className="salary-input-group">
                      <label htmlFor={`salary-${component.id}`}>{component.label}</label>
                      <input
                        id={`salary-${component.id}`}
                        type="number"
                        value={currentValue}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setSalaryData({
                            ...salaryData,
                            [editingUserId]: {
                              ...(salaryData[editingUserId] || {}),
                              [component.id]: newValue
                            }
                          });
                        }}
                        placeholder="0"
                        min="0"
                        step="0.01"
                        className="salary-input"
                        disabled={!isValidSelection}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="modal-button modal-button-cancel"
                onClick={() => setShowModal(false)}
              >
                Đóng
              </button>
              <button 
                className="modal-button modal-button-save"
                onClick={handleSave}
                disabled={!isValidSelection}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedUserIds.length > 0 && (
        <div className="employee-cards-container">
          <label className="cards-label">Nhân viên đã chọn:</label>
          <div className="employee-cards-grid">
            {selectedUserIds.map(userId => {
              const user = users.find(u => u.id === userId);
              if (!user) return null;
              
              return (
                <div key={userId} className="employee-card">
                  <div className="employee-card-content">
                    <div className="employee-info">
                      <div className="employee-name">{user.fullName}</div>
                      <div className="employee-username">{user.username}</div>
                    </div>
                  </div>
                  <div className="employee-card-actions">
                    <button
                      className="employee-card-button"
                      onClick={() => {
                        setEditingUserId(userId);
                        setShowModal(true);
                      }}
                    >
                      Xem / chỉnh sửa
                    </button>
                    <button
                      className="employee-card-remove"
                      onClick={() => setSelectedUserIds(selectedUserIds.filter(id => id !== userId))}
                      title="Xóa khỏi danh sách"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default InputWorkDay;
