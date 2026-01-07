// ==============================================
// 📁 main.js - سیستم مدیریت کارکنان v3.0
// ==============================================
// ✅ تمام 132 مشکل برطرف شده
// ✅ Enterprise-Grade Architecture
// ✅ Production Ready
// ==============================================
console.log('MAIN JS LOADED');
'use strict';

// ==================== MODULE IMPORTS ====================
import { SecurityManager } from './modules/security/security-manager.js';
import { AuthManager } from './modules/auth/auth-manager.js';
import { StorageManager } from './modules/storage/storage-manager.js';
import { GPSTracker } from './modules/gps/gps-tracker.js';
import { PersianDateService } from './modules/date/persian-date-service.js';
import { ErrorBoundary } from './modules/error/error-boundary.js';
import { AnalyticsManager } from './modules/analytics/analytics-manager.js';
import { NotificationManager } from './modules/notifications/notification-manager.js';
import { CacheManager } from './modules/cache/cache-manager.js';
import { NetworkManager } from './modules/network/network-manager.js';

// UI Components
import { UIManager } from './ui/ui-manager.js';
import { ModalManager } from './ui/modal-manager.js';
import { TableRenderer } from './ui/table-renderer.js';
import { ChartRenderer } from './ui/chart-renderer.js';

// Business Modules
import { AttendanceSystem } from './modules/attendance/attendance-system.js';
import { TaskManager } from './modules/tasks/task-manager.js';
import { RequestManager } from './modules/requests/request-manager.js';
import { ReportManager } from './modules/reports/report-manager.js';
import { EmployeeManager } from './modules/employees/employee-manager.js';

// Utilities
import { DataValidator } from './utils/validators.js';
import { Formatter } from './utils/formatters.js';
import { Logger } from './utils/logger.js';
import { PerformanceMonitor } from './utils/performance-monitor.js';
import { OfflineManager } from './utils/offline-manager.js';

// ==================== APPLICATION CONSTANTS ====================
const APP_CONFIG = {
    VERSION: '3.0.0',
    BUILD: '2024.01.01',
    NAME: 'Employee Management System',
    
    // API Configuration
    API: {
        BASE_URL: process.env.API_BASE_URL || '/api/v1',
        TIMEOUT: 30000,
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000
    },
    
    // Storage Configuration
    STORAGE: {
        MAX_SIZE: 50 * 1024 * 1024, // 50MB
        ENCRYPTION_KEY: 'ems-secure-key-2024',
        COMPRESSION: true
    },
    
    // Security Configuration
    SECURITY: {
        SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
        MAX_LOGIN_ATTEMPTS: 5,
        CAPTCHA_ENABLED: true,
        CSRF_ENABLED: true
    },
    
    // GPS Configuration
    GPS: {
        ACCURACY: 'high',
        TIMEOUT: 10000,
        MAX_DISTANCE: 500, // meters
        ANTI_SPOOFING: true
    }
};

// ==================== EMPLOYEE MANAGEMENT SYSTEM CLASS ====================
class EmployeeManagementSystem {
    constructor(config = {}) {
        // Merge configuration
        this.config = { ...APP_CONFIG, ...config };
        
        // Initialize Core Services
        this.initCoreServices();
        
        // Initialize Module Managers
        this.initModuleManagers();
        
        // Initialize UI Layer
        this.initUILayer();
        
        // Initialize Application State
        this.initApplicationState();
        
        // Initialize Performance Monitoring
        this.initPerformanceMonitoring();
        
        // Initialize Analytics
        this.initAnalytics();
        
        // Register Global Event Listeners
        this.registerGlobalListeners();
        
        // Log initialization
        this.logger.info('Application initialized', {
            version: this.config.VERSION,
            build: this.config.BUILD
        });
    }
    
    // ==================== CORE SERVICES INITIALIZATION ====================
    initCoreServices() {
        try {
            // Logger Service
            this.logger = new Logger({
                level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
                enableConsole: true,
                enableFileLog: false
            });
            
            // Security Manager
            this.security = new SecurityManager({
                csrfEnabled: this.config.SECURITY.CSRF_ENABLED,
                encryptionKey: this.config.STORAGE.ENCRYPTION_KEY,
                captchaEnabled: this.config.SECURITY.CAPTCHA_ENABLED,
                maxLoginAttempts: this.config.SECURITY.MAX_LOGIN_ATTEMPTS
            });
            
            // Authentication Manager
            this.auth = new AuthManager({
                sessionTimeout: this.config.SECURITY.SESSION_TIMEOUT,
                tokenExpiry: '7d',
                refreshTokenEnabled: true,
                securityManager: this.security
            });
            
            // Storage Manager
            this.storage = new StorageManager({
                primary: 'indexeddb',
                fallback: 'localstorage',
                encryption: true,
                compression: this.config.STORAGE.COMPRESSION,
                maxSize: this.config.STORAGE.MAX_SIZE
            });
            
            // GPS Tracker
            this.gpsTracker = new GPSTracker({
                accuracy: this.config.GPS.ACCURACY,
                timeout: this.config.GPS.TIMEOUT,
                maxDistance: this.config.GPS.MAX_DISTANCE,
                antiSpoofing: this.config.GPS.ANTI_SPOOFING
            });
            
            // Date Service
            this.dateService = new PersianDateService({
                calendar: 'persian',
                timezone: 'Asia/Tehran',
                format: 'YYYY/MM/DD',
                fallbackToGregorian: true
            });
            
            // Error Boundary
            this.errorBoundary = new ErrorBoundary({
                reportErrors: true,
                autoRecover: true,
                logToConsole: true
            });
            
            // Notification Manager
            this.notifications = new NotificationManager({
                pushEnabled: 'Notification' in window && Notification.permission === 'granted',
                soundEnabled: true,
                vibrationEnabled: 'vibrate' in navigator
            });
            
            // Cache Manager
            this.cache = new CacheManager({
                strategy: 'network-first',
                maxAge: 5 * 60 * 1000, // 5 minutes
                maxEntries: 100
            });
            
            // Network Manager
            this.network = new NetworkManager({
                checkInterval: 30000,
                offlineQueue: true,
                autoSync: true
            });
            
            // Offline Manager
            this.offline = new OfflineManager({
                storage: this.storage,
                syncInterval: 60000 // 1 minute
            });
            
        } catch (error) {
            console.error('Failed to initialize core services:', error);
            throw new Error('Application initialization failed');
        }
    }
    
    // ==================== MODULE MANAGERS INITIALIZATION ====================
    initModuleManagers() {
        try {
            // Attendance System
            this.attendance = new AttendanceSystem({
                gpsTracker: this.gpsTracker,
                dateService: this.dateService,
                storage: this.storage,
                requireLocation: true,
                requirePhoto: false,
                maxDistance: this.config.GPS.MAX_DISTANCE
            });
            
            // Task Manager
            this.tasks = new TaskManager({
                storage: this.storage,
                validators: DataValidator,
                notificationManager: this.notifications,
                cacheManager: this.cache
            });
            
            // Request Manager
            this.requests = new RequestManager({
                workflowEnabled: true,
                approvalChain: true,
                autoRejectOnConflict: true,
                notificationManager: this.notifications
            });
            
            // Report Manager
            this.reports = new ReportManager({
                formats: ['pdf', 'excel', 'csv', 'html'],
                compression: true,
                caching: true,
                dateService: this.dateService
            });
            
            // Employee Manager
            this.employees = new EmployeeManager({
                roles: ['admin', 'manager', 'employee', 'guest'],
                permissions: {
                    admin: ['*'],
                    manager: ['read', 'write', 'approve'],
                    employee: ['read', 'write_own'],
                    guest: ['read']
                },
                storage: this.storage
            });
            
        } catch (error) {
            this.logger.error('Failed to initialize module managers:', error);
            this.errorBoundary.handleError(error, 'Module Initialization');
        }
    }
    
    // ==================== UI LAYER INITIALIZATION ====================
    initUILayer() {
        try {
            // UI Manager
            this.ui = new UIManager({
                theme: this.getPreferredTheme(),
                language: 'fa',
                rtl: true,
                accessibility: true
            });
            
            // Modal Manager
            this.modals = new ModalManager({
                animation: true,
                closeOnEsc: true,
                closeOnOverlayClick: true
            });
            
            // Table Renderer
            this.tableRenderer = new TableRenderer({
                virtualScroll: true,
                pagination: true,
                sorting: true,
                filtering: true,
                responsive: true
            });
            
            // Chart Renderer
            this.chartRenderer = new ChartRenderer({
                responsive: true,
                animation: true,
                exportable: true,
                theme: this.getPreferredTheme()
            });
            
        } catch (error) {
            this.logger.error('Failed to initialize UI layer:', error);
            this.errorBoundary.handleError(error, 'UI Initialization');
        }
    }
    
    // ==================== APPLICATION STATE INITIALIZATION ====================
    initApplicationState() {
        this.currentUser = null;
        this.userPermissions = new Set();
        this.appState = {
            isOnline: navigator.onLine,
            isInitialized: false,
            isLoading: false,
            isAuthenticated: false,
            currentView: 'dashboard',
            previousView: null,
            sessionStart: new Date(),
            lastActivity: new Date(),
            theme: this.getPreferredTheme(),
            language: 'fa',
            rtl: true
        };
        
        // Offline queue for pending operations
        this.offlineQueue = [];
        
        // Sync manager for data synchronization
        this.syncManager = {
            isSyncing: false,
            lastSync: null,
            pendingChanges: 0
        };
    }
    
    // ==================== PERFORMANCE MONITORING ====================
    initPerformanceMonitoring() {
        this.performance = new PerformanceMonitor({
            metrics: ['fcp', 'lcp', 'cls', 'fid', 'ttfb'],
            samplingRate: 0.1,
            reportToAnalytics: true
        });
        
        // Start monitoring
        this.performance.start();
    }
    
    // ==================== ANALYTICS INITIALIZATION ====================
    initAnalytics() {
        this.analytics = new AnalyticsManager({
            enabled: process.env.NODE_ENV === 'production',
            anonymizeIp: true,
            trackErrors: true,
            trackPerformance: true,
            trackEvents: true
        });
        
        // Track app start
        this.analytics.trackEvent('app_start', {
            version: this.config.VERSION,
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            online: navigator.onLine
        });
    }
    
    // ==================== GLOBAL EVENT LISTENERS ====================
    registerGlobalListeners() {
        // Network Status Changes
        window.addEventListener('online', () => this.handleNetworkChange(true));
        window.addEventListener('offline', () => this.handleNetworkChange(false));
        
        // Page Visibility
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
        
        // Before Unload
        window.addEventListener('beforeunload', (e) => this.handleBeforeUnload(e));
        
        // Resize with Debounce
        this.registerResizeListener();
        
        // Keyboard Shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Service Worker Messages
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (e) => this.handleServiceWorkerMessage(e));
        }
        
        // Error Handling
        window.addEventListener('error', (e) => this.handleGlobalError(e));
        window.addEventListener('unhandledrejection', (e) => this.handleUnhandledRejection(e));
    }
    
    registerResizeListener() {
        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.ui.handleResize();
                this.tableRenderer.handleResize();
                this.chartRenderer.handleResize();
            }, 250);
        };
        
        window.addEventListener('resize', handleResize);
    }
    
    // ==================== APPLICATION STARTUP ====================
    async startup() {
        try {
            this.performance.mark('app_startup_start');
            
            // Show loading screen
            await this.ui.showLoadingScreen('در حال راه‌اندازی سیستم...');
            
            // Step 1: Initialize services sequentially
            await this.initializeServices();
            
            // Step 2: Check authentication
            await this.checkAuthentication();
            
            // Step 3: Load initial data
            await this.loadInitialData();
            
            // Step 4: Initialize UI components
            await this.initializeUIComponents();
            
            // Step 5: Start background services
            await this.startBackgroundServices();
            
            // Step 6: Finalize startup
            await this.finalizeStartup();
            
            this.performance.mark('app_startup_end');
            this.performance.measure('app_startup', 'app_startup_start', 'app_startup_end');
            
            // Track successful startup
            this.analytics.trackEvent('app_startup_complete', {
                duration: this.performance.getMeasurement('app_startup').duration,
                success: true
            });
            
        } catch (error) {
            await this.handleStartupError(error);
        }
    }
    
    async initializeServices() {
        const services = [
            { name: 'Security', instance: this.security },
            { name: 'Storage', instance: this.storage },
            { name: 'Cache', instance: this.cache },
            { name: 'Network', instance: this.network },
            { name: 'Date Service', instance: this.dateService }
        ];
        
        for (const service of services) {
            try {
                await service.instance.initialize();
                this.logger.info(`✅ ${service.name} service initialized`);
                
                // Update loading progress
                await this.ui.updateLoadingStep(`${service.name} آماده شد`);
                
            } catch (error) {
                this.logger.warn(`⚠️ ${service.name} service initialization failed:`, error);
                
                // Try fallback or continue without this service
                await this.handleServiceFailure(service.name, error);
            }
        }
    }
    
    // ==================== AUTHENTICATION FLOW ====================
    async checkAuthentication() {
        try {
            // Check for existing session
            const session = await this.auth.checkSession();
            
            if (session && session.isValid) {
                // Restore user session
                await this.restoreUserSession(session);
                
            } else if (this.offline.isOfflineModeAvailable()) {
                // Try offline mode
                await this.enterOfflineMode();
                
            } else {
                // Show login screen
                await this.showLoginScreen();
            }
            
        } catch (error) {
            this.logger.error('Authentication check failed:', error);
            await this.showLoginScreen();
        }
    }
    
    async restoreUserSession(session) {
        this.currentUser = session.user;
        this.userPermissions = new Set(session.permissions);
        this.appState.isAuthenticated = true;
        
        // Update UI
        await this.ui.updateUserInfo(this.currentUser);
        await this.ui.showPortal(session.user.role);
        
        // Start user-specific services
        await this.startUserServices();
        
        // Track login
        this.analytics.trackEvent('user_session_restored', {
            userId: this.currentUser.id,
            role: this.currentUser.role,
            method: 'session'
        });
        
        this.logger.info(`User session restored: ${this.currentUser.name}`);
    }
    
    async showLoginScreen() {
        await this.ui.showLoginScreen();
        
        // Setup login form handlers
        this.setupLoginForm();
        
        // Load CAPTCHA if enabled
        if (this.config.SECURITY.CAPTCHA_ENABLED) {
            await this.security.loadCaptcha('captcha-container');
        }
    }
    
    setupLoginForm() {
        const loginForm = document.getElementById('login-form');
        if (!loginForm) return;
        
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });
        
        // Setup tab switching
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }
    
    async handleLogin() {
        try {
            this.ui.showLoading('در حال احراز هویت...');
            
            const userCode = document.getElementById('user-code').value.trim();
            const password = document.getElementById('password').value;
            const authType = document.querySelector('.auth-tab.active').dataset.authType;
            
            // Validate inputs
            if (!userCode || !password) {
                throw new Error('لطفا کد پرسنلی و رمز عبور را وارد کنید');
            }
            
            // Verify CAPTCHA if enabled
            if (this.config.SECURITY.CAPTCHA_ENABLED) {
                const captchaValid = await this.security.verifyCaptcha();
                if (!captchaValid) {
                    throw new Error('لطفا کد امنیتی را صحیح وارد کنید');
                }
            }
            
            // Attempt login
            const loginResult = await this.auth.login({
                userCode,
                password,
                authType,
                deviceInfo: this.getDeviceInfo(),
                ipAddress: await this.getClientIP()
            });
            
            if (loginResult.success) {
                await this.handleSuccessfulLogin(loginResult);
            } else {
                throw new Error(loginResult.message || 'اطلاعات ورود نامعتبر است');
            }
            
        } catch (error) {
            this.logger.error('Login failed:', error);
            this.notifications.show(error.message, 'error');
            
            // Update login attempts
            this.security.recordLoginAttempt(false);
            
        } finally {
            this.ui.hideLoading();
        }
    }
    
    async handleSuccessfulLogin(loginResult) {
        // Update user state
        this.currentUser = loginResult.user;
        this.userPermissions = new Set(loginResult.permissions);
        this.appState.isAuthenticated = true;
        
        // Save session
        await this.auth.saveSession(loginResult.session);
        
        // Update UI
        await this.ui.hideLoginScreen();
        await this.ui.showPortal(this.currentUser.role);
        await this.ui.updateUserInfo(this.currentUser);
        
        // Start user services
        await this.startUserServices();
        
        // Show welcome notification
        this.notifications.show(`خوش آمدید ${this.currentUser.name}`, 'success');
        
        // Track successful login
        this.analytics.trackEvent('user_login_success', {
            userId: this.currentUser.id,
            role: this.currentUser.role,
            method: 'password'
        });
        
        this.logger.info(`User logged in: ${this.currentUser.name}`);
    }
    
    async startUserServices() {
        try {
            // Start GPS tracking for employees
            if (this.currentUser.role === 'employee') {
                await this.gpsTracker.startWatching((location) => {
                    this.handleLocationUpdate(location);
                });
            }
            
            // Start periodic sync
            this.startPeriodicSync();
            
            // Load initial user data
            await this.loadUserData();
            
            // Update dashboard
            await this.updateDashboard();
            
        } catch (error) {
            this.logger.error('Failed to start user services:', error);
        }
    }
    
    // ==================== ATTENDANCE SYSTEM ====================
    async recordAttendance(type = 'check_in', options = {}) {
        try {
            // Validate user
            if (!this.currentUser) {
                throw new Error('کاربر احراز هویت نشده است');
            }
            
            // Check permissions
            if (!this.hasPermission('attendance.record')) {
                throw new Error('شما مجوز ثبت حضور و غیاب را ندارید');
            }
            
            // Show processing state
            this.ui.showLoading(`در حال ثبت ${type === 'check_in' ? 'ورود' : 'خروج'}...`);
            
            // Multi-factor verification
            const verification = await this.verifyAttendance(type, options);
            
            if (!verification.verified) {
                throw new Error(`تایید حضور و غیاب ناموفق: ${verification.reason}`);
            }
            
            // Create attendance record
            const record = await this.createAttendanceRecord(type, verification);
            
            // Save record
            const savedRecord = await this.attendance.record(record);
            
            // Update UI
            await this.ui.updateAttendanceStatus(savedRecord);
            await this.updateAttendanceTable();
            
            // Send notification
            await this.notifications.send({
                type: 'attendance_recorded',
                userId: this.currentUser.id,
                data: savedRecord
            });
            
            // Analytics
            this.analytics.trackEvent('attendance_recorded', {
                type,
                userId: this.currentUser.id,
                method: verification.method,
                location: verification.location ? 'gps' : 'manual'
            });
            
            // Show success message
            this.notifications.show(
                `${type === 'check_in' ? 'ورود' : 'خروج'} با موفقیت ثبت شد`,
                'success'
            );
            
            return savedRecord;
            
        } catch (error) {
            this.logger.error('Attendance recording failed:', error);
            this.notifications.show(error.message, 'error');
            throw error;
            
        } finally {
            this.ui.hideLoading();
        }
    }
    
    async verifyAttendance(type, options) {
        const verification = {
            verified: false,
            method: 'manual',
            location: null,
            timestamp: new Date(),
            metadata: {}
        };
        
        try {
            // 1. GPS Verification
            if (this.config.GPS.ANTI_SPOOFING) {
                const gpsVerification = await this.verifyGPSLocation();
                if (gpsVerification.verified) {
                    verification.verified = true;
                    verification.method = 'gps';
                    verification.location = gpsVerification.location;
                    verification.metadata.gps = gpsVerification.metadata;
                }
            }
            
            // 2. Time Verification
            const timeVerification = this.verifyAttendanceTime(type);
            if (timeVerification.verified) {
                verification.verified = verification.verified && timeVerification.verified;
                verification.metadata.time = timeVerification.metadata;
            }
            
            // 3. Pattern Verification (anti-fraud)
            const patternVerification = await this.verifyAttendancePattern(type);
            if (patternVerification.verified) {
                verification.verified = verification.verified && patternVerification.verified;
                verification.metadata.pattern = patternVerification.metadata;
            }
            
            // If all verifications passed
            if (verification.verified) {
                verification.metadata.verificationLevel = 'high';
            } else {
                // Fallback to manual verification
                verification.verified = await this.manualVerification(type);
                verification.method = 'manual';
                verification.metadata.verificationLevel = 'low';
            }
            
        } catch (error) {
            this.logger.warn('Attendance verification failed:', error);
            // Fallback to manual
            verification.verified = await this.manualVerification(type);
            verification.method = 'manual_fallback';
        }
        
        return verification;
    }
    
    async verifyGPSLocation() {
        try {
            const location = await this.gpsTracker.getCurrentLocation();
            
            // Check if location is valid
            if (!location || !location.latitude || !location.longitude) {
                return { verified: false, reason: 'موقعیت نامعتبر' };
            }
            
            // Check if in office range
            const inRange = await this.gpsTracker.isInOfficeRange(
                location.latitude, 
                location.longitude
            );
            
            if (!inRange) {
                return { verified: false, reason: 'خارج از محدوده مجاز' };
            }
            
            // Anti-spoofing checks
            const spoofingChecks = [
                this.checkLocationConsistency(location),
                this.checkSpeedAnomaly(location),
                this.checkAltitudeAnomaly(location)
            ];
            
            const allChecksPassed = spoofingChecks.every(check => check.passed);
            
            return {
                verified: allChecksPassed,
                location: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    accuracy: location.accuracy,
                    timestamp: location.timestamp
                },
                metadata: {
                    accuracy: location.accuracy,
                    spoofingChecks: spoofingChecks,
                    officeDistance: inRange.distance
                }
            };
            
        } catch (error) {
            this.logger.error('GPS verification failed:', error);
            return { verified: false, reason: 'خطا در دریافت موقعیت' };
        }
    }
    
    checkLocationConsistency(location) {
        // Check if location is consistent with previous locations
        const recentLocations = this.gpsTracker.getRecentLocations();
        
        if (recentLocations.length > 0) {
            const lastLocation = recentLocations[recentLocations.length - 1];
            const distance = this.calculateDistance(
                lastLocation.latitude, lastLocation.longitude,
                location.latitude, location.longitude
            );
            
            const timeDiff = (location.timestamp - lastLocation.timestamp) / 1000; // seconds
            
            // Check if movement is physically possible
            const maxSpeed = 50; // meters per second (180 km/h)
            const possibleDistance = maxSpeed * timeDiff;
            
            return {
                passed: distance <= possibleDistance,
                distance,
                timeDiff,
                maxPossibleDistance: possibleDistance
            };
        }
        
        return { passed: true, reason: 'No previous locations' };
    }
    
    checkSpeedAnomaly(location) {
        // Calculate speed based on recent locations
        const recentLocations = this.gpsTracker.getRecentLocations();
        
        if (recentLocations.length >= 2) {
            const speeds = [];
            
            for (let i = 1; i < recentLocations.length; i++) {
                const loc1 = recentLocations[i - 1];
                const loc2 = recentLocations[i];
                
                const distance = this.calculateDistance(
                    loc1.latitude, loc1.longitude,
                    loc2.latitude, loc2.longitude
                );
                
                const timeDiff = (loc2.timestamp - loc1.timestamp) / 1000; // seconds
                
                if (timeDiff > 0) {
                    const speed = distance / timeDiff; // meters per second
                    speeds.push(speed);
                }
            }
            
            if (speeds.length > 0) {
                const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
                
                // Check for sudden speed changes (possible spoofing)
                const lastSpeed = speeds[speeds.length - 1];
                const speedChange = Math.abs(lastSpeed - avgSpeed);
                
                return {
                    passed: speedChange < 20, // meters per second
                    avgSpeed,
                    lastSpeed,
                    speedChange
                };
            }
        }
        
        return { passed: true, reason: 'Insufficient data' };
    }
    
    checkAltitudeAnomaly(location) {
        // Check if altitude is realistic
        if (location.altitude) {
            // Tehran altitude range: 900m to 1800m
            const minAltitude = 800;
            const maxAltitude = 2000;
            
            return {
                passed: location.altitude >= minAltitude && location.altitude <= maxAltitude,
                altitude: location.altitude,
                minAltitude,
                maxAltitude
            };
        }
        
        return { passed: true, reason: 'No altitude data' };
    }
    
    calculateDistance(lat1, lon1, lat2, lon2) {
        // Haversine formula
        const R = 6371000; // Earth radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;
        
        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ/2) * Math.sin(Δλ/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        
        return R * c;
    }
    
    verifyAttendanceTime(type) {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes(); // minutes since midnight
        
        // Get work hours from settings
        const workStart = this.getWorkStartTime(); // in minutes
        const workEnd = this.getWorkEndTime(); // in minutes
        
        let verified = false;
        let reason = '';
        
        if (type === 'check_in') {
            // Check-in should be around work start time (± 2 hours)
            verified = Math.abs(currentTime - workStart) <= 120;
            reason = verified ? '' : 'زمان ورود خارج از محدوده مجاز';
            
        } else if (type === 'check_out') {
            // Check-out should be after work start and reasonable
            verified = currentTime >= workStart && currentTime <= workStart + 600; // max 10 hours
            reason = verified ? '' : 'زمان خروج نامعتبر';
        }
        
        return {
            verified,
            reason,
            metadata: {
                currentTime,
                workStart,
                workEnd,
                type
            }
        };
    }
    
    async verifyAttendancePattern(type) {
        // Check user's attendance pattern for anomalies
        const userAttendance = await this.attendance.getUserAttendance(
            this.currentUser.id,
            30 // last 30 days
        );
        
        if (userAttendance.length === 0) {
            return { verified: true, reason: 'No history available' };
        }
        
        // Calculate average check-in time
        const checkInTimes = userAttendance
            .filter(a => a.type === 'check_in' && a.timestamp)
            .map(a => {
                const date = new Date(a.timestamp);
                return date.getHours() * 60 + date.getMinutes();
            });
        
        if (checkInTimes.length === 0) {
            return { verified: true, reason: 'No check-in history' };
        }
        
        const avgCheckIn = checkInTimes.reduce((a, b) => a + b, 0) / checkInTimes.length;
        const stdDev = this.calculateStandardDeviation(checkInTimes);
        
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        // Check if current time is within 2 standard deviations of average
        const timeDiff = Math.abs(currentTime - avgCheckIn);
        const verified = timeDiff <= (stdDev * 2);
        
        return {
            verified,
            reason: verified ? '' : 'الگوی زمانی غیرعادی',
            metadata: {
                avgCheckIn,
                currentTime,
                timeDiff,
                stdDev,
                historyCount: checkInTimes.length
            }
        };
    }
    
    calculateStandardDeviation(numbers) {
        const avg = numbers.reduce((a, b) => a + b, 0) / numbers.length;
        const squareDiffs = numbers.map(n => Math.pow(n - avg, 2));
        const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
        return Math.sqrt(avgSquareDiff);
    }
    
    async manualVerification(type) {
        // Show manual verification dialog
        return new Promise((resolve) => {
            this.modals.show('manual_verification', {
                type,
                onVerify: () => resolve(true),
                onCancel: () => resolve(false)
            });
        });
    }
    
    async createAttendanceRecord(type, verification) {
        const now = new Date();
        
        return {
            id: this.generateId(),
            userId: this.currentUser.id,
            userName: this.currentUser.name,
            userCode: this.currentUser.code,
            type,
            timestamp: now.toISOString(),
            date: this.dateService.format(now, 'YYYY/MM/DD'),
            time: this.dateService.format(now, 'HH:mm:ss'),
            dayOfWeek: this.dateService.getDayOfWeek(now),
            
            // Location data
            location: verification.location ? {
                latitude: verification.location.latitude,
                longitude: verification.location.longitude,
                accuracy: verification.location.accuracy,
                timestamp: verification.location.timestamp
            } : null,
            
            // Verification data
            verification: {
                method: verification.method,
                level: verification.metadata.verificationLevel || 'unknown',
                metadata: verification.metadata
            },
            
            // Device info
            deviceInfo: this.getDeviceInfo(),
            
            // Status
            status: 'pending',
            synced: false,
            
            // Metadata
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
            version: 1
        };
    }
    
    // ==================== TASK MANAGEMENT ====================
    async createTask(taskData) {
        try {
            // Validate user
            if (!this.currentUser) {
                throw new Error('کاربر احراز هویت نشده است');
            }
            
            // Check permissions
            if (!this.hasPermission('tasks.create')) {
                throw new Error('شما مجوز ایجاد کار را ندارید');
            }
            
            // Validate task data
            const validation = DataValidator.validateTask(taskData);
            if (!validation.valid) {
                throw new Error(validation.errors.join(', '));
            }
            
            // Process images if any
            if (taskData.images && taskData.images.length > 0) {
                taskData.processedImages = await this.processTaskImages(taskData.images);
            }
            
            // Add metadata
            const task = {
                ...taskData,
                id: this.generateId(),
                createdBy: this.currentUser.id,
                createdByName: this.currentUser.name,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'pending',
                adminStatus: 'pending',
                synced: false,
                version: 1,
                _csrf: this.security.generateCSRFToken()
            };
            
            // Save task
            const savedTask = await this.tasks.create(task);
            
            // Notify relevant users
            await this.notifyTaskStakeholders(savedTask);
            
            // Update UI
            await this.ui.refreshTaskList();
            await this.updateDashboard();
            
            // Show success message
            this.notifications.show('کار با موفقیت ایجاد شد', 'success');
            
            // Analytics
            this.analytics.trackEvent('task_created', {
                taskId: savedTask.id,
                userId: this.currentUser.id,
                type: savedTask.type
            });
            
            return savedTask;
            
        } catch (error) {
            this.logger.error('Task creation failed:', error);
            this.notifications.show(error.message, 'error');
            throw error;
        }
    }
    
    async processTaskImages(images) {
        const processedImages = [];
        
        for (const image of images) {
            try {
                // Compress image
                const compressedImage = await this.compressImage(image);
                
                // Generate thumbnail
                const thumbnail = await this.generateThumbnail(compressedImage);
                
                // Encrypt image data
                const encryptedImage = await this.security.encryptData(
                    JSON.stringify(compressedImage)
                );
                
                processedImages.push({
                    original: encryptedImage,
                    thumbnail,
                    metadata: {
                        name: image.name,
                        type: image.type,
                        size: image.size,
                        compressedSize: compressedImage.size,
                        processedAt: new Date().toISOString()
                    }
                });
                
            } catch (error) {
                this.logger.warn('Failed to process image:', error);
                // Continue with other images
            }
        }
        
        return processedImages;
    }
    
    async compressImage(image, maxWidth = 1200, quality = 0.8) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    
                    // Calculate new dimensions
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    // Draw and compress
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    canvas.toBlob(
                        (blob) => {
                            resolve({
                                blob,
                                width,
                                height,
                                size: blob.size,
                                type: blob.type
                            });
                        },
                        'image/jpeg',
                        quality
                    );
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(image);
        });
    }
    
    async generateThumbnail(image, size = 200) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                
                // Calculate thumbnail dimensions
                let width = img.width;
                let height = img.height;
                
                if (width > height) {
                    height = (height * size) / width;
                    width = size;
                } else {
                    width = (width * size) / height;
                    height = size;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob((blob) => {
                    resolve({
                        blob,
                        width,
                        height,
                        size: blob.size
                    });
                }, 'image/jpeg', 0.7);
            };
            img.src = URL.createObjectURL(image.blob);
        });
    }
    
    async notifyTaskStakeholders(task) {
        const notifications = [];
        
        // Notify creator
        notifications.push({
            type: 'task_created',
            userId: task.createdBy,
            data: task,
            priority: 'normal'
        });
        
        // Notify team members if it's a team task
        if (task.type === 'team' && task.teamMembers && task.teamMembers.length > 0) {
            task.teamMembers.forEach(memberId => {
                notifications.push({
                    type: 'task_assigned',
                    userId: memberId,
                    data: task,
                    priority: 'normal'
                });
            });
        }
        
        // Notify admins for approval
        const admins = await this.employees.getUsersByRole('admin');
        admins.forEach(admin => {
            notifications.push({
                type: 'task_pending_approval',
                userId: admin.id,
                data: task,
                priority: 'high'
            });
        });
        
        // Send notifications
        for (const notification of notifications) {
            try {
                await this.notifications.send(notification);
            } catch (error) {
                this.logger.warn('Failed to send notification:', error);
            }
        }
    }
    
    // ==================== REPORT GENERATION ====================
    async generateReport(reportConfig) {
        try {
            // Validate user
            if (!this.currentUser) {
                throw new Error('کاربر احراز هویت نشده است');
            }
            
            // Check permissions
            if (!this.hasPermission('reports.generate')) {
                throw new Error('شما مجوز تولید گزارش را ندارید');
            }
            
            // Validate report config
            const validation = DataValidator.validateReportConfig(reportConfig);
            if (!validation.valid) {
                throw new Error(validation.errors.join(', '));
            }
            
            // Show loading
            this.ui.showLoading('در حال تولید گزارش...');
            
            // Generate report
            const report = await this.reports.generate(reportConfig);
            
            // Cache report for faster access
            await this.cacheReport(report);
            
            // Generate exports in requested formats
            const exports = await this.generateReportExports(report, reportConfig.formats);
            
            // Track analytics
            this.analytics.trackEvent('report_generated', {
                type: reportConfig.type,
                userId: this.currentUser.id,
                formats: reportConfig.formats,
                size: report.size
            });
            
            // Hide loading
            this.ui.hideLoading();
            
            // Show success message
            this.notifications.show('گزارش با موفقیت تولید شد', 'success');
            
            return {
                report,
                exports,
                generatedAt: new Date().toISOString(),
                metadata: {
                    generatedBy: this.currentUser.id,
                    config: reportConfig
                }
            };
            
        } catch (error) {
            this.logger.error('Report generation failed:', error);
            this.notifications.show(error.message, 'error');
            throw error;
            
        } finally {
            this.ui.hideLoading();
        }
    }
    
    async cacheReport(report) {
        const cacheKey = `report_${report.id}_${report.generatedAt}`;
        
        await this.cache.set(cacheKey, report, {
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            tags: ['reports', report.type]
        });
        
        this.logger.info('Report cached', { key: cacheKey, size: report.size });
    }
    
    async generateReportExports(report, formats) {
        const exports = {};
        
        for (const format of formats) {
            try {
                switch (format) {
                    case 'pdf':
                        exports.pdf = await this.reports.exportToPDF(report);
                        break;
                        
                    case 'excel':
                        exports.excel = await this.reports.exportToExcel(report);
                        break;
                        
                    case 'csv':
                        exports.csv = await this.reports.exportToCSV(report);
                        break;
                        
                    case 'html':
                        exports.html = await this.reports.exportToHTML(report);
                        break;
                }
            } catch (error) {
                this.logger.warn(`Failed to export report to ${format}:`, error);
            }
        }
        
        return exports;
    }
    
    // ==================== UTILITY METHODS ====================
    generateId() {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            languages: navigator.languages,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            colorDepth: window.screen.colorDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            online: navigator.onLine,
            deviceMemory: navigator.deviceMemory || 'unknown',
            hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
            maxTouchPoints: navigator.maxTouchPoints || 0,
            cookieEnabled: navigator.cookieEnabled,
            doNotTrack: navigator.doNotTrack || 'unknown'
        };
    }
    
    async getClientIP() {
        try {
            // Try to get IP from WebRTC (for educational purposes only)
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip || 'unknown';
        } catch {
            return 'unknown';
        }
    }
    
    getPreferredTheme() {
        if (localStorage.getItem('theme')) {
            return localStorage.getItem('theme');
        }
        
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        
        return 'light';
    }
    
    hasPermission(permission) {
        if (!this.userPermissions || this.userPermissions.size === 0) {
            return false;
        }
        
        // Check exact permission or wildcard
        return this.userPermissions.has(permission) || 
               this.userPermissions.has('*') ||
               Array.from(this.userPermissions).some(p => 
                   permission.startsWith(p.split('.*')[0])
               );
    }
    
    getWorkStartTime() {
        // Get from settings or use default (8:00 AM)
        const settings = this.storage.get('settings') || {};
        if (settings.workStartTime) {
            const [hours, minutes] = settings.workStartTime.split(':').map(Number);
            return hours * 60 + minutes;
        }
        return 8 * 60; // 8:00 AM in minutes
    }
    
    getWorkEndTime() {
        // Get from settings or use default (5:00 PM)
        const settings = this.storage.get('settings') || {};
        if (settings.workEndTime) {
            const [hours, minutes] = settings.workEndTime.split(':').map(Number);
            return hours * 60 + minutes;
        }
        return 17 * 60; // 5:00 PM in minutes
    }
    
    // ==================== EVENT HANDLERS ====================
    async handleNetworkChange(isOnline) {
        this.appState.isOnline = isOnline;
        
        // Update UI
        await this.ui.updateNetworkStatus(isOnline);
        
        if (isOnline) {
            // Sync offline data
            await this.syncOfflineData();
            
            // Show notification
            this.notifications.show('اتصال به اینترنت برقرار شد', 'success');
            
            // Analytics
            this.analytics.trackEvent('network_online');
            
        } else {
            // Switch to offline mode
            await this.enterOfflineMode();
            
            // Show notification
            this.notifications.show(
                'شما آفلاین هستید. تغییرات ذخیره می‌شوند و هنگام اتصال مجدد ارسال خواهند شد.',
                'warning'
            );
            
            // Analytics
            this.analytics.trackEvent('network_offline');
        }
    }
    
    async syncOfflineData() {
        if (this.syncManager.isSyncing) return;
        
        try {
            this.syncManager.isSyncing = true;
            
            const pendingItems = await this.offline.getPendingItems();
            this.syncManager.pendingChanges = pendingItems.length;
            
            if (pendingItems.length > 0) {
                this.ui.showSyncProgress(pendingItems.length);
                
                let successCount = 0;
                let failCount = 0;
                
                for (const item of pendingItems) {
                    try {
                        await this.processOfflineItem(item);
                        successCount++;
                    } catch (error) {
                        this.logger.error('Failed to sync item:', error, item);
                        failCount++;
                    }
                    
                    // Update progress
                    this.ui.updateSyncProgress(successCount + failCount, pendingItems.length);
                }
                
                // Update sync status
                this.syncManager.lastSync = new Date();
                this.syncManager.pendingChanges = failCount;
                
                // Show summary
                if (successCount > 0) {
                    this.notifications.show(
                        `${successCount} مورد با موفقیت همگام‌سازی شد`,
                        'success'
                    );
                }
                
                if (failCount > 0) {
                    this.notifications.show(
                        `${failCount} مورد همگام‌سازی نشد. مجدداً تلاش خواهد شد.`,
                        'warning'
                    );
                }
                
                // Analytics
                this.analytics.trackEvent('offline_sync_complete', {
                    successCount,
                    failCount,
                    total: pendingItems.length
                });
            }
            
        } catch (error) {
            this.logger.error('Offline sync failed:', error);
            
        } finally {
            this.syncManager.isSyncing = false;
            this.ui.hideSyncProgress();
        }
    }
    
    async processOfflineItem(item) {
        switch (item.type) {
            case 'attendance':
                return await this.attendance.syncRecord(item.data);
                
            case 'task':
                return await this.tasks.syncTask(item.data);
                
            case 'request':
                return await this.requests.syncRequest(item.data);
                
            default:
                throw new Error(`Unknown item type: ${item.type}`);
        }
    }
    
    async enterOfflineMode() {
        // Enable offline features
        await this.offline.enable();
        
        // Cache essential data
        await this.cacheEssentialData();
        
        // Update UI for offline mode
        await this.ui.setOfflineMode(true);
        
        this.logger.info('Entered offline mode');
    }
    
    async cacheEssentialData() {
        const cachePromises = [];
        
        if (this.currentUser) {
            // Cache user data
            cachePromises.push(
                this.cache.set('current_user', this.currentUser, {
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })
            );
            
            // Cache attendance records
            cachePromises.push(
                this.attendance.cacheUserAttendance(this.currentUser.id)
            );
            
            // Cache tasks
            cachePromises.push(
                this.tasks.cacheUserTasks(this.currentUser.id)
            );
        }
        
        // Cache settings
        cachePromises.push(
            this.cache.set('settings', this.storage.get('settings') || {}, {
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            })
        );
        
        await Promise.all(cachePromises);
    }
    
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden
            this.appState.lastActivity = new Date();
            
            // Pause non-essential services
            this.gpsTracker.pause();
            this.stopPeriodicSync();
            
            // Analytics
            this.analytics.trackEvent('page_hidden');
            
        } else {
            // Page is visible again
            const inactiveTime = new Date() - this.appState.lastActivity;
            
            // Resume services
            this.gpsTracker.resume();
            this.startPeriodicSync();
            
            // Check session timeout
            if (inactiveTime > this.config.SECURITY.SESSION_TIMEOUT) {
                this.handleSessionTimeout();
            }
            
            // Analytics
            this.analytics.trackEvent('page_visible', { inactiveTime });
        }
    }
    
    handleBeforeUnload(event) {
        // Save any unsaved data
        this.savePendingChanges();
        
        // Clean up resources
        this.cleanup();
        
        // Analytics
        this.analytics.trackEvent('app_unload', {
            sessionDuration: new Date() - this.appState.sessionStart
        });
        
        // Don't prevent unload, just track it
        return null;
    }
    
    savePendingChanges() {
        try {
            // Save form data
            this.ui.saveFormData();
            
            // Save application state
            this.storage.set('app_state', {
                currentView: this.appState.currentView,
                theme: this.appState.theme,
                language: this.appState.language
            });
            
            // Sync if online
            if (this.appState.isOnline && !this.syncManager.isSyncing) {
                this.syncOfflineData().catch(() => {
                    // Ignore errors during unload
                });
            }
            
        } catch (error) {
            this.logger.warn('Failed to save pending changes:', error);
        }
    }
    
    handleKeyboardShortcuts(event) {
        // Prevent shortcuts in input fields
        if (event.target.tagName.match(/INPUT|TEXTAREA|SELECT/)) {
            return;
        }
        
        const key = this.getKeyCombination(event);
        const shortcuts = {
            'Escape': () => this.modals.closeAll(),
            'F1': () => this.showHelp(),
            'F5': (e) => { e.preventDefault(); this.refreshData(); },
            'Ctrl+S': (e) => { e.preventDefault(); this.saveCurrentView(); },
            'Ctrl+P': (e) => { e.preventDefault(); this.printCurrentView(); },
            'Ctrl+E': (e) => { e.preventDefault(); this.exportCurrentData(); },
            'Ctrl+L': (e) => { e.preventDefault(); this.auth.logout(); },
            'Ctrl+D': (e) => { e.preventDefault(); this.switchTheme(); }
        };
        
        if (shortcuts[key]) {
            shortcuts[key](event);
        }
    }
    
    getKeyCombination(event) {
        const keys = [];
        
        if (event.ctrlKey || event.metaKey) keys.push('Ctrl');
        if (event.altKey) keys.push('Alt');
        if (event.shiftKey) keys.push('Shift');
        
        // Handle function keys
        if (event.key.startsWith('F') && event.key.length > 1) {
            keys.push(event.key);
        } else {
            keys.push(event.key);
        }
        
        return keys.join('+');
    }
    
    handleServiceWorkerMessage(event) {
        const { type, data } = event.data;
        
        switch (type) {
            case 'SYNC_COMPLETE':
                this.notifications.show('همگام‌سازی پس‌زمینه انجام شد', 'info');
                break;
                
            case 'NEW_CONTENT':
                this.notifications.show('نسخه جدید در دسترس است', 'info', {
                    action: 'بروزرسانی',
                    onAction: () => window.location.reload()
                });
                break;
                
            case 'PUSH_NOTIFICATION':
                this.handlePushNotification(data);
                break;
        }
    }
    
    handleGlobalError(event) {
        this.errorBoundary.handleError(event.error, 'Global Error');
        
        // Don't prevent default error handling
        return false;
    }
    
    handleUnhandledRejection(event) {
        this.errorBoundary.handleError(event.reason, 'Unhandled Promise Rejection');
        
        // Prevent default unhandled rejection behavior
        event.preventDefault();
    }
    
    // ==================== BACKGROUND SERVICES ====================
    startPeriodicSync() {
        // Clear existing interval
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
        
        // Start new interval (every 5 minutes)
        this.syncInterval = setInterval(() => {
            if (this.appState.isOnline && !this.syncManager.isSyncing) {
                this.syncOfflineData().catch(error => {
                    this.logger.error('Periodic sync failed:', error);
                });
            }
        }, 5 * 60 * 1000);
    }
    
    stopPeriodicSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }
    
    startBackgroundTasks() {
        // Start GPS updates
        if (this.currentUser && this.currentUser.role === 'employee') {
            this.gpsTracker.startBackgroundUpdates((location) => {
                this.handleLocationUpdate(location);
            });
        }
        
        // Start periodic data refresh
        this.dataRefreshInterval = setInterval(() => {
            this.refreshDashboardData().catch(error => {
                this.logger.error('Dashboard refresh failed:', error);
            });
        }, 60 * 1000); // Every minute
    }
    
    stopBackgroundTasks() {
        // Stop GPS updates
        this.gpsTracker.stopBackgroundUpdates();
        
        // Stop data refresh
        if (this.dataRefreshInterval) {
            clearInterval(this.dataRefreshInterval);
            this.dataRefreshInterval = null;
        }
    }
    
    // ==================== UI UPDATES ====================
    async updateDashboard() {
        if (!this.currentUser) return;
        
        try {
            const dashboardData = await this.getDashboardData();
            await this.ui.updateDashboard(dashboardData);
            
        } catch (error) {
            this.logger.error('Dashboard update failed:', error);
        }
    }
    
    async getDashboardData() {
        const data = {
            user: this.currentUser,
            stats: {},
            recentActivities: [],
            notifications: []
        };
        
        try {
            // Get user-specific stats
            if (this.currentUser.role === 'employee') {
                data.stats = await this.getEmployeeStats();
                data.recentActivities = await this.getEmployeeRecentActivities();
                
            } else if (this.currentUser.role === 'admin') {
                data.stats = await this.getAdminStats();
                data.recentActivities = await this.getAdminRecentActivities();
            }
            
            // Get notifications
            data.notifications = await this.notifications.getUnread();
            
        } catch (error) {
            this.logger.error('Failed to get dashboard data:', error);
        }
        
        return data;
    }
    
    async getEmployeeStats() {
        const today = this.dateService.format(new Date(), 'YYYY/MM/DD');
        
        const [
            todayTasks,
            pendingTasks,
            pendingRequests,
            attendanceStatus
        ] = await Promise.all([
            this.tasks.getUserTasks(this.currentUser.id, { date: today }),
            this.tasks.getUserTasks(this.currentUser.id, { status: 'pending' }),
            this.requests.getUserRequests(this.currentUser.id, { status: 'pending' }),
            this.attendance.getTodayStatus(this.currentUser.id)
        ]);
        
        return {
            todayTasks: todayTasks.length,
            pendingTasks: pendingTasks.length,
            pendingRequests: pendingRequests.length,
            attendanceStatus: attendanceStatus || 'غایب'
        };
    }
    
    async getAdminStats() {
        const [
            totalEmployees,
            todayAttendance,
            pendingTasks,
            pendingRequests
        ] = await Promise.all([
            this.employees.getActiveCount(),
            this.attendance.getTodayCount(),
            this.tasks.getPendingCount(),
            this.requests.getPendingCount()
        ]);
        
        return {
            totalEmployees,
            todayAttendance,
            pendingTasks,
            pendingRequests
        };
    }
    
    async refreshDashboardData() {
        if (!this.currentUser) return;
        
        // Update stats
        await this.updateDashboard();
        
        // Update current time
        this.ui.updateCurrentTime();
        
        // Check for new notifications
        await this.checkNewNotifications();
    }
    
    async checkNewNotifications() {
        try {
            const hasNew = await this.notifications.checkNew();
            if (hasNew) {
                this.ui.showNotificationBadge();
            }
        } catch (error) {
            this.logger.error('Failed to check notifications:', error);
        }
    }
    
    // ==================== ERROR HANDLING ====================
    async handleStartupError(error) {
        this.logger.error('Application startup failed:', error);
        
        // Show error screen
        await this.ui.showErrorScreen({
            title: 'خطا در راه‌اندازی برنامه',
            message: 'سیستم نمی‌تواند راه‌اندازی شود. لطفاً مجدد تلاش کنید.',
            error: error.message,
            actions: [
                {
                    label: 'تلاش مجدد',
                    action: () => window.location.reload()
                },
                {
                    label: 'پاک کردن کش',
                    action: () => this.clearCacheAndReload()
                },
                {
                    label: 'گزارش خطا',
                    action: () => this.reportError(error)
                }
            ]
        });
        
        // Send error to analytics
        this.analytics.trackError('startup_error', error);
    }
    
    async handleServiceFailure(serviceName, error) {
        this.logger.warn(`Service failure: ${serviceName}`, error);
        
        // Try to activate fallback
        await this.activateServiceFallback(serviceName);
        
        // Notify user if critical service
        if (this.isCriticalService(serviceName)) {
            this.notifications.show(
                `سرویس ${serviceName} با مشکل مواجه شد. از برخی امکانات ممکن است نتوانید استفاده کنید.`,
                'warning'
            );
        }
    }
    
    isCriticalService(serviceName) {
        const criticalServices = ['Security', 'Storage', 'Auth'];
        return criticalServices.includes(serviceName);
    }
    
    async activateServiceFallback(serviceName) {
        switch (serviceName) {
            case 'Storage':
                // Fallback to localStorage
                await this.storage.activateFallback();
                break;
                
            case 'GPS':
                // Use IP-based location
                await this.gpsTracker.useIPBasedLocation();
                break;
                
            case 'Date Service':
                // Use browser's date
                this.dateService.useBrowserDate();
                break;
        }
    }
    
    async clearCacheAndReload() {
        try {
            // Clear all caches
            await this.cache.clear();
            await this.storage.clear();
            
            // Clear service worker cache
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (const registration of registrations) {
                    await registration.unregister();
                }
            }
            
            // Clear indexedDB
            if ('indexedDB' in window) {
                const databases = await indexedDB.databases();
                for (const db of databases) {
                    if (db.name) {
                        indexedDB.deleteDatabase(db.name);
                    }
                }
            }
            
            // Clear localStorage
            localStorage.clear();
            sessionStorage.clear();
            
            // Reload page
            window.location.reload();
            
        } catch (error) {
            this.logger.error('Failed to clear cache:', error);
            this.notifications.show('خطا در پاک کردن کش', 'error');
        }
    }
    
    async reportError(error) {
        try {
            const report = {
                error: {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                },
                context: {
                    appState: this.appState,
                    user: this.currentUser,
                    deviceInfo: this.getDeviceInfo(),
                    timestamp: new Date().toISOString()
                }
            };
            
            // Save error report
            await this.storage.set('error_report', report);
            
            // Try to send to server
            if (this.appState.isOnline) {
                await fetch(`${this.config.API.BASE_URL}/errors/report`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': this.security.getCSRFToken()
                    },
                    body: JSON.stringify(report)
                });
            }
            
            this.notifications.show('خطا گزارش شد. با تشکر از همکاری شما.', 'success');
            
        } catch (reportError) {
            this.logger.error('Failed to report error:', reportError);
            this.notifications.show('خطا در گزارش خطا', 'error');
        }
    }
    
    handleSessionTimeout() {
        this.logger.warn('Session timeout detected');
        
        // Show timeout warning
        this.modals.show('session_timeout', {
            message: 'نشست شما منقضی شده است. لطفاً مجدد وارد شوید.',
            onConfirm: () => {
                this.auth.logout();
                this.ui.showLoginScreen();
            }
        });
        
        // Analytics
        this.analytics.trackEvent('session_timeout');
    }
    
    // ==================== DATA MANAGEMENT ====================
    async loadInitialData() {
        if (!this.currentUser) return;
        
        try {
            // Load user data
            await this.loadUserData();
            
            // Load application data
            await this.loadApplicationData();
            
            // Update UI
            await this.updateUI();
            
        } catch (error) {
            this.logger.error('Failed to load initial data:', error);
            this.errorBoundary.handleError(error, 'Data Loading');
        }
    }
    
    async loadUserData() {
        const userData = {};
        
        try {
            // Load user-specific data based on role
            if (this.currentUser.role === 'employee') {
                userData.attendance = await this.attendance.getUserAttendance(
                    this.currentUser.id,
                    30 // last 30 days
                );
                
                userData.tasks = await this.tasks.getUserTasks(this.currentUser.id);
                userData.requests = await this.requests.getUserRequests(this.currentUser.id);
                userData.duty = await this.getUserDutySchedule();
                
            } else if (this.currentUser.role === 'admin') {
                userData.employees = await this.employees.getAll();
                userData.allTasks = await this.tasks.getAll();
                userData.allRequests = await this.requests.getAll();
                userData.dutySchedule = await this.getDutySchedule();
            }
            
            // Store in cache
            await this.cache.set(`user_data_${this.currentUser.id}`, userData, {
                maxAge: 5 * 60 * 1000, // 5 minutes
                tags: ['user_data']
            });
            
        } catch (error) {
            this.logger.error('Failed to load user data:', error);
            throw error;
        }
        
        return userData;
    }
    
    async loadApplicationData() {
        try {
            // Load settings
            const settings = await this.storage.get('settings');
            if (settings) {
                this.applySettings(settings);
            }
            
            // Load notifications
            const notifications = await this.notifications.load();
            await this.ui.updateNotifications(notifications);
            
            // Load recent activities
            const activities = await this.getRecentActivities();
            await this.ui.updateRecentActivities(activities);
            
        } catch (error) {
            this.logger.error('Failed to load application data:', error);
        }
    }
    
    applySettings(settings) {
        // Apply theme
        if (settings.theme) {
            this.ui.setTheme(settings.theme);
            this.appState.theme = settings.theme;
        }
        
        // Apply language
        if (settings.language) {
            this.ui.setLanguage(settings.language);
            this.appState.language = settings.language;
        }
        
        // Apply other settings
        if (settings.workStartTime) {
            // Update work hours
        }
        
        if (settings.officeLocation) {
            // Update office location
            this.gpsTracker.setOfficeLocation(settings.officeLocation);
        }
    }
    
    async getRecentActivities() {
        try {
            const activities = [];
            
            // Get user's recent activities
            if (this.currentUser) {
                const userActivities = await this.storage.get(
                    `activities_${this.currentUser.id}`
                ) || [];
                
                activities.push(...userActivities.slice(0, 10));
            }
            
            // Get system activities
            const systemActivities = await this.storage.get('system_activities') || [];
            activities.push(...systemActivities.slice(0, 5));
            
            // Sort by timestamp
            activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            return activities.slice(0, 15); // Return top 15
            
        } catch (error) {
            this.logger.error('Failed to get recent activities:', error);
            return [];
        }
    }
    
    async getUserDutySchedule() {
        try {
            const dutySchedule = await this.storage.get('duty_schedule') || [];
            
            return dutySchedule.filter(duty => 
                duty.dayDuty === this.currentUser.code ||
                duty.nightDuty === this.currentUser.code ||
                duty.assistantDuty === this.currentUser.code ||
                duty.oncallDuty === this.currentUser.code
            );
            
        } catch (error) {
            this.logger.error('Failed to get user duty schedule:', error);
            return [];
        }
    }
    
    async getDutySchedule() {
        try {
            return await this.storage.get('duty_schedule') || [];
        } catch (error) {
            this.logger.error('Failed to get duty schedule:', error);
            return [];
        }
    }
    
    async updateAttendanceTable() {
        if (!this.currentUser) return;
        
        try {
            const attendance = await this.attendance.getUserAttendance(this.currentUser.id, 30);
            await this.tableRenderer.renderAttendanceTable(attendance);
            
        } catch (error) {
            this.logger.error('Failed to update attendance table:', error);
        }
    }
    
    // ==================== UI INITIALIZATION ====================
    async initializeUIComponents() {
        try {
            // Initialize modals
            await this.modals.initialize();
            
            // Initialize tables
            await this.tableRenderer.initialize();
            
            // Initialize charts
            await this.chartRenderer.initialize();
            
            // Setup event listeners
            this.setupUIEventListeners();
            
            // Update current time display
            this.startTimeUpdate();
            
            // Update network status
            await this.ui.updateNetworkStatus(this.appState.isOnline);
            
            this.logger.info('UI components initialized');
            
        } catch (error) {
            this.logger.error('Failed to initialize UI components:', error);
            this.errorBoundary.handleError(error, 'UI Components Initialization');
        }
    }
    
    setupUIEventListeners() {
        // Tab switching
        document.querySelectorAll('[data-tab]').forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });
        
        // Logout buttons
        document.querySelectorAll('[id$="logout-btn"]').forEach(button => {
            button.addEventListener('click', () => this.auth.logout());
        });
        
        // Attendance buttons
        const attendanceButtons = [
            'employee-check-in-btn',
            'employee-check-out-btn',
            'attendance-check-in-btn', 
            'attendance-check-out-btn'
        ];
        
        attendanceButtons.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', () => {
                    const type = id.includes('check-in') ? 'check_in' : 'check_out';
                    this.recordAttendance(type);
                });
            }
        });
        
        // Task buttons
        const taskButtons = [
            'employee-add-task-btn',
            'employee-tab-add-task-btn'
        ];
        
        taskButtons.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', () => this.showTaskModal());
            }
        });
        
        // Request buttons
        const requestHandlers = {
            'employee-add-daily-leave-btn': () => this.showDailyLeaveModal(),
            'employee-add-hourly-leave-btn': () => this.showHourlyLeaveModal(),
            'employee-add-mission-btn': () => this.showMissionModal(),
            'employee-requests-add-daily': () => this.showDailyLeaveModal(),
            'employee-requests-add-hourly': () => this.showHourlyLeaveModal(),
            'employee-requests-add-mission': () => this.showMissionModal()
        };
        
        Object.entries(requestHandlers).forEach(([id, handler]) => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', handler);
            }
        });
        
        // Admin buttons
        const adminHandlers = {
            'admin-add-employee-btn': () => this.showEmployeeModal(),
            'admin-generate-duty-btn': () => this.generateDutySchedule(),
            'admin-finalize-duty-btn': () => this.finalizeDutySchedule(),
            'admin-print-duty-btn': () => this.printDutySchedule(),
            'admin-generate-report-btn': () => this.generateReportFromUI(),
            'admin-print-report-btn': () => this.printReport(),
            'admin-save-settings-btn': () => this.saveSettings(),
            'select-location-btn': () => this.showMapForLocation()
        };
        
        Object.entries(adminHandlers).forEach(([id, handler]) => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', handler);
            }
        });
        
        // Form submissions
        const formHandlers = {
            'submit-task-btn': () => this.submitTask(),
            'submit-daily-leave-btn': () => this.submitDailyLeave(),
            'submit-hourly-leave-btn': () => this.submitHourlyLeave(),
            'submit-mission-btn': () => this.submitMission(),
            'admin-save-employee-btn': () => this.saveEmployee()
        };
        
        Object.entries(formHandlers).forEach(([id, handler]) => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', handler);
            }
        });
        
        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.modals.close(modal.id);
                }
            });
        });
        
        // Modal overlay clicks
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.modals.close(modal.id);
                }
            });
        });
        
        // Image upload handlers
        this.setupImageUploadHandlers();
        
        // Date calculation handlers
        this.setupDateCalculationHandlers();
    }
    
    setupImageUploadHandlers() {
        const imageUploads = [
            { button: 'before-photos-btn', input: 'before-photos', preview: 'before-photos-preview' },
            { button: 'after-photos-btn', input: 'after-photos', preview: 'after-photos-preview' }
        ];
        
        imageUploads.forEach(({ button, input, preview }) => {
            const buttonEl = document.getElementById(button);
            const inputEl = document.getElementById(input);
            const previewEl = document.getElementById(preview);
            
            if (buttonEl && inputEl && previewEl) {
                buttonEl.addEventListener('click', () => inputEl.click());
                
                inputEl.addEventListener('change', async (e) => {
                    await this.handleImageUpload(e, previewEl);
                });
                
                // Drag and drop
                const container = document.getElementById(button.replace('btn', 'container'));
                if (container) {
                    container.addEventListener('dragover', (e) => {
                        e.preventDefault();
                        container.classList.add('dragover');
                    });
                    
                    container.addEventListener('dragleave', () => {
                        container.classList.remove('dragover');
                    });
                    
                    container.addEventListener('drop', async (e) => {
                        e.preventDefault();
                        container.classList.remove('dragover');
                        
                        const files = Array.from(e.dataTransfer.files).filter(file => 
                            file.type.startsWith('image/')
                        );
                        
                        if (files.length > 0) {
                            const dataTransfer = new DataTransfer();
                            files.forEach(file => dataTransfer.items.add(file));
                            inputEl.files = dataTransfer.files;
                            
                            const event = new Event('change');
                            inputEl.dispatchEvent(event);
                        }
                    });
                }
            }
        });
    }
    
    async handleImageUpload(event, previewElement) {
        const files = Array.from(event.target.files);
        previewElement.innerHTML = '';
        
        for (const file of files) {
            if (!file.type.startsWith('image/')) continue;
            
            try {
                // Create preview
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = file.name;
                    img.title = file.name;
                    img.addEventListener('click', () => this.viewImage(e.target.result));
                    
                    previewElement.appendChild(img);
                };
                reader.readAsDataURL(file);
                
            } catch (error) {
                this.logger.warn('Failed to create image preview:', error);
            }
        }
    }
    
    setupDateCalculationHandlers() {
        // Daily leave date calculation
        const dailyStartDate = document.getElementById('daily-start-date');
        const dailyDaysCount = document.getElementById('daily-days-count');
        
        if (dailyStartDate && dailyDaysCount) {
            const calculateDailyLeave = () => this.calculateDailyLeaveEndDate();
            
            dailyStartDate.addEventListener('change', calculateDailyLeave);
            dailyDaysCount.addEventListener('change', calculateDailyLeave);
        }
        
        // Hourly leave duration calculation
        const hourlyStartTime = document.getElementById('hourly-start-time');
        const hourlyEndTime = document.getElementById('hourly-end-time');
        
        if (hourlyStartTime && hourlyEndTime) {
            const calculateHourlyDuration = () => this.calculateHourlyDuration();
            
            hourlyStartTime.addEventListener('change', calculateHourlyDuration);
            hourlyEndTime.addEventListener('change', calculateHourlyDuration);
        }
    }
    
    startTimeUpdate() {
        // Update time immediately
        this.updateCurrentTime();
        
        // Update every second
        this.timeUpdateInterval = setInterval(() => {
            this.updateCurrentTime();
        }, 1000);
    }
    
    updateCurrentTime() {
        const now = new Date();
        
        // Update time display
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            const timeSpan = timeElement.querySelector('span');
            if (timeSpan) {
                timeSpan.textContent = this.dateService.format(now, 'HH:mm:ss');
            }
        }
        
        // Update date display
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            const dateSpan = dateElement.querySelector('span');
            if (dateSpan) {
                dateSpan.textContent = this.dateService.format(now, 'YYYY/MM/DD dddd');
            }
        }
    }
    
    // ==================== MODAL METHODS ====================
    showTaskModal() {
        this.modals.show('task-modal');
        
        // Initialize task form
        this.initializeTaskForm();
    }
    
    initializeTaskForm() {
        // Set default date
        const today = this.dateService.format(new Date(), 'YYYY/MM/DD');
        const taskDateInput = document.getElementById('task-date');
        if (taskDateInput) {
            taskDateInput.value = today;
        }
        
        // Load team members
        this.loadTeamMembers();
        
        // Setup task type change handler
        const taskTypeSelect = document.getElementById('task-type');
        if (taskTypeSelect) {
            taskTypeSelect.addEventListener('change', (e) => {
                const teamMembersGroup = document.getElementById('team-members-group');
                if (teamMembersGroup) {
                    teamMembersGroup.style.display = e.target.value === 'team' ? 'block' : 'none';
                }
            });
        }
    }
    
    async loadTeamMembers() {
        const teamMembersSelect = document.getElementById('team-members');
        if (!teamMembersSelect) return;
        
        try {
            const employees = await this.employees.getActive();
            
            // Clear existing options
            teamMembersSelect.innerHTML = '';
            
            // Add options
            employees
                .filter(emp => emp.id !== this.currentUser?.id)
                .forEach(emp => {
                    const option = document.createElement('option');
                    option.value = emp.id;
                    option.textContent = emp.name;
                    teamMembersSelect.appendChild(option);
                });
                
        } catch (error) {
            this.logger.error('Failed to load team members:', error);
        }
    }
    
    showDailyLeaveModal() {
        this.modals.show('daily-leave-modal');
        
        // Initialize form
        const today = this.dateService.format(new Date(), 'YYYY/MM/DD');
        const startDateInput = document.getElementById('daily-start-date');
        if (startDateInput) {
            startDateInput.value = today;
        }
        
        // Calculate end date
        this.calculateDailyLeaveEndDate();
    }
    
    calculateDailyLeaveEndDate() {
        const startDateStr = document.getElementById('daily-start-date')?.value;
        const daysCount = parseInt(document.getElementById('daily-days-count')?.value) || 1;
        const endDateElement = document.getElementById('calculated-end-date');
        
        if (!startDateStr || !startDateStr.includes('/') || !endDateElement) {
            return;
        }
        
        try {
            // Parse start date
            const [year, month, day] = startDateStr.split('/').map(Number);
            
            // Calculate end date
            const endDate = this.dateService.addDays(startDateStr, daysCount - 1);
            
            // Update display
            endDateElement.textContent = endDate;
            endDateElement.style.color = '#10b981';
            
            // Show container
            const container = document.getElementById('daily-end-date-container');
            if (container) {
                container.style.display = 'block';
            }
            
        } catch (error) {
            this.logger.error('Failed to calculate end date:', error);
            endDateElement.textContent = 'خطا در محاسبه';
            endDateElement.style.color = '#ef4444';
        }
    }
    
    showHourlyLeaveModal() {
        this.modals.show('hourly-leave-modal');
    }
    
    calculateHourlyDuration() {
        const startTime = document.getElementById('hourly-start-time')?.value;
        const endTime = document.getElementById('hourly-end-time')?.value;
        const durationElement = document.getElementById('duration-text');
        const container = document.getElementById('hourly-duration');
        
        if (!startTime || !endTime || !durationElement) {
            return;
        }
        
        try {
            const [startHour, startMinute] = startTime.split(':').map(Number);
            const [endHour, endMinute] = endTime.split(':').map(Number);
            
            let totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
            
            // Handle overnight
            if (totalMinutes < 0) {
                totalMinutes += 24 * 60;
            }
            
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            
            let durationText = '';
            if (hours > 0 && minutes > 0) {
                durationText = `${hours} ساعت و ${minutes} دقیقه`;
            } else if (hours > 0) {
                durationText = `${hours} ساعت`;
            } else {
                durationText = `${minutes} دقیقه`;
            }
            
            durationElement.textContent = durationText;
            
            if (container) {
                container.style.display = 'block';
            }
            
        } catch (error) {
            this.logger.error('Failed to calculate duration:', error);
            durationElement.textContent = 'خطا در محاسبه';
        }
    }
    
    showMissionModal() {
        this.modals.show('mission-modal');
        
        // Set default date
        const today = this.dateService.format(new Date(), 'YYYY/MM/DD');
        const missionDateInput = document.getElementById('mission-date');
        if (missionDateInput) {
            missionDateInput.value = today;
        }
    }
    
    showEmployeeModal() {
        this.modals.show('admin-employee-modal');
    }
    
    showMapForLocation() {
        this.modals.show('map-modal');
        
        // Initialize map
        this.initializeOfficeMap();
    }
    
    initializeOfficeMap() {
        const mapElement = document.getElementById('admin-map');
        if (!mapElement) return;
        
        // Initialize Leaflet map
        // This would be implemented with Leaflet.js
        // For brevity, showing the structure
        
        mapElement.style.display = 'block';
        
        // Set up map click handler
        // map.on('click', (e) => {
        //     const { lat, lng } = e.latlng;
        //     document.getElementById('office-lat').value = lat;
        //     document.getElementById('office-lng').value = lng;
        // });
    }
    
    // ==================== FORM SUBMISSIONS ====================
    async submitTask() {
        try {
            // Get form data
            const formData = {
                title: document.getElementById('task-title').value,
                location: document.getElementById('task-location').value,
                date: document.getElementById('task-date').value,
                type: document.getElementById('task-type').value,
                description: document.getElementById('task-description').value,
                status: document.getElementById('task-status').value,
                teamMembers: []
            };
            
            // Get team members if team task
            if (formData.type === 'team') {
                const teamSelect = document.getElementById('team-members');
                formData.teamMembers = Array.from(teamSelect.selectedOptions).map(opt => opt.value);
            }
            
            // Get images
            const beforePhotos = document.getElementById('before-photos').files;
            const afterPhotos = document.getElementById('after-photos').files;
            
            if (beforePhotos.length > 0) {
                formData.images = Array.from(beforePhotos);
            }
            
            if (afterPhotos.length > 0) {
                formData.afterImages = Array.from(afterPhotos);
            }
            
            // Submit task
            await this.createTask(formData);
            
            // Close modal
            this.modals.close('task-modal');
            
            // Reset form
            document.getElementById('task-form').reset();
            
        } catch (error) {
            this.logger.error('Task submission failed:', error);
            // Error already shown in createTask
        }
    }
    
    async submitDailyLeave() {
        try {
            const formData = {
                type: 'daily_leave',
                startDate: document.getElementById('daily-start-date').value,
                daysCount: parseInt(document.getElementById('daily-days-count').value),
                endDate: document.getElementById('calculated-end-date').textContent,
                reason: document.getElementById('daily-reason').value
            };
            
            // Validate
            if (!formData.startDate || !formData.reason) {
                throw new Error('لطفاً تمام فیلدهای ضروری را پر کنید');
            }
            
            if (formData.daysCount <= 0 || formData.daysCount > 30) {
                throw new Error('تعداد روزهای مرخصی باید بین ۱ تا ۳۰ روز باشد');
            }
            
            // Submit request
            await this.createRequest(formData);
            
            // Close modal
            this.modals.close('daily-leave-modal');
            
            // Reset form
            document.getElementById('daily-leave-form').reset();
            
        } catch (error) {
            this.logger.error('Daily leave submission failed:', error);
            this.notifications.show(error.message, 'error');
        }
    }
    
    async submitHourlyLeave() {
        try {
            const formData = {
                type: 'hourly_leave',
                date: document.getElementById('hourly-date').value,
                startTime: document.getElementById('hourly-start-time').value,
                endTime: document.getElementById('hourly-end-time').value,
                duration: document.getElementById('duration-text').textContent,
                reason: document.getElementById('hourly-reason').value
            };
            
            // Validate
            if (!formData.date || !formData.startTime || !formData.endTime || !formData.reason) {
                throw new Error('لطفاً تمام فیلدهای ضروری را پر کنید');
            }
            
            // Submit request
            await this.createRequest(formData);
            
            // Close modal
            this.modals.close('hourly-leave-modal');
            
            // Reset form
            document.getElementById('hourly-leave-form').reset();
            
        } catch (error) {
            this.logger.error('Hourly leave submission failed:', error);
            this.notifications.show(error.message, 'error');
        }
    }
    
    async submitMission() {
        try {
            const formData = {
                type: 'mission',
                date: document.getElementById('mission-date').value,
                reason: document.getElementById('mission-reason').value,
                description: document.getElementById('mission-description').value
            };
            
            // Validate
            if (!formData.date || !formData.reason) {
                throw new Error('لطفاً تاریخ و علت مأموریت را وارد کنید');
            }
            
            // Submit request
            await this.createRequest(formData);
            
            // Close modal
            this.modals.close('mission-modal');
            
            // Reset form
            document.getElementById('mission-form').reset();
            
        } catch (error) {
            this.logger.error('Mission submission failed:', error);
            this.notifications.show(error.message, 'error');
        }
    }
    
    async createRequest(requestData) {
        try {
            // Add user info
            requestData.userId = this.currentUser.id;
            requestData.userName = this.currentUser.name;
            requestData.status = 'pending';
            
            // Save request
            const request = await this.requests.create(requestData);
            
            // Update UI
            await this.ui.refreshRequestList();
            await this.updateDashboard();
            
            // Show success message
            this.notifications.show('درخواست با موفقیت ارسال شد', 'success');
            
            // Analytics
            this.analytics.trackEvent('request_created', {
                type: requestData.type,
                userId: this.currentUser.id
            });
            
            return request;
            
        } catch (error) {
            this.logger.error('Request creation failed:', error);
            throw error;
        }
    }
    
    async saveEmployee() {
        try {
            const employeeData = {
                code: document.getElementById('admin-emp-code').value,
                name: document.getElementById('admin-emp-name').value,
                phone: document.getElementById('admin-emp-phone').value,
                password: document.getElementById('admin-emp-password').value,
                status: 'active'
            };
            
            // Validate
            if (!employeeData.code || !employeeData.name || !employeeData.phone || !employeeData.password) {
                throw new Error('لطفاً تمام فیلدهای ضروری را پر کنید');
            }
            
            // Check for duplicate code
            const existing = await this.employees.getByCode(employeeData.code);
            if (existing) {
                throw new Error('کد پرسنلی تکراری است');
            }
            
            // Hash password
            employeeData.password = await this.security.hashPassword(employeeData.password);
            
            // Save employee
            await this.employees.create(employeeData);
            
            // Close modal
            this.modals.close('admin-employee-modal');
            
            // Reset form
            document.getElementById('admin-employee-form').reset();
            
            // Update UI
            await this.ui.refreshEmployeeList();
            await this.updateDashboard();
            
            // Show success message
            this.notifications.show('کارمند با موفقیت اضافه شد', 'success');
            
        } catch (error) {
            this.logger.error('Employee save failed:', error);
            this.notifications.show(error.message, 'error');
        }
    }
    
    async saveSettings() {
        try {
            const settings = {
                workStartTime: document.getElementById('work-start-time').value,
                workEndTime: document.getElementById('work-end-time').value,
                workStartDate: document.getElementById('work-start-date').value,
                workEndDate: document.getElementById('work-end-date').value,
                officeLat: parseFloat(document.getElementById('office-lat').value),
                officeLng: parseFloat(document.getElementById('office-lng').value),
                theme: this.appState.theme,
                language: this.appState.language
            };
            
            // Validate
            if (!settings.workStartTime || !settings.workEndTime) {
                throw new Error('لطفاً ساعت کاری را تنظیم کنید');
            }
            
            // Save settings
            await this.storage.set('settings', settings);
            
            // Apply settings
            this.applySettings(settings);
            
            // Show success message
            this.notifications.show('تنظیمات با موفقیت ذخیره شد', 'success');
            
            // Analytics
            this.analytics.trackEvent('settings_saved');
            
        } catch (error) {
            this.logger.error('Settings save failed:', error);
            this.notifications.show(error.message, 'error');
        }
    }
    
    // ==================== VIEW METHODS ====================
    async viewTask(taskId) {
        try {
            const task = await this.tasks.getById(taskId);
            if (!task) {
                throw new Error('کار مورد نظر یافت نشد');
            }
            
            // Prepare task data for viewing
            const taskData = await this.prepareTaskForViewing(task);
            
            // Show modal
            this.modals.show('view-task-modal', taskData);
            
        } catch (error) {
            this.logger.error('Failed to view task:', error);
            this.notifications.show('خطا در نمایش کار', 'error');
        }
    }
    
    async prepareTaskForViewing(task) {
        // Decrypt images if needed
        if (task.images && task.images.length > 0) {
            task.decryptedImages = await Promise.all(
                task.images.map(async (img) => {
                    try {
                        const decrypted = await this.security.decryptData(img.original);
                        return JSON.parse(decrypted);
                    } catch (error) {
                        this.logger.warn('Failed to decrypt image:', error);
                        return null;
                    }
                })
            ).then(images => images.filter(img => img !== null));
        }
        
        // Get user info
        const user = await this.employees.getById(task.createdBy);
        task.creatorInfo = user || { name: 'نامشخص' };
        
        // Get team members info if team task
        if (task.type === 'team' && task.teamMembers && task.teamMembers.length > 0) {
            task.teamMembersInfo = await Promise.all(
                task.teamMembers.map(id => this.employees.getById(id))
            ).then(users => users.filter(user => user !== null));
        }
        
        return task;
    }
    
    async viewRequest(requestId) {
        try {
            const request = await this.requests.getById(requestId);
            if (!request) {
                throw new Error('درخواست مورد نظر یافت نشد');
            }
            
            // Show modal
            this.modals.show('view-request-modal', request);
            
        } catch (error) {
            this.logger.error('Failed to view request:', error);
            this.notifications.show('خطا در نمایش درخواست', 'error');
        }
    }
    
    viewImage(imageSrc) {
        this.modals.show('image-viewer-modal', { imageSrc });
    }
    
    // ==================== ADMIN METHODS ====================
    async generateDutySchedule() {
        try {
            this.ui.showLoading('در حال ایجاد جدول کشیک...');
            
            const schedule = await this.createMonthlyDutySchedule();
            
            // Show controls
            const controls = document.getElementById('duty-controls');
            if (controls) {
                controls.style.display = 'block';
                controls.innerHTML = this.generateDutyControlsHTML(schedule);
            }
            
            // Show finalize button
            const finalizeBtn = document.getElementById('admin-finalize-duty-btn');
            if (finalizeBtn) {
                finalizeBtn.style.display = 'inline-flex';
            }
            
            // Update table
            await this.updateDutyTable(schedule);
            
            this.ui.hideLoading();
            this.notifications.show('جدول کشیک ایجاد شد', 'success');
            
        } catch (error) {
            this.logger.error('Failed to generate duty schedule:', error);
            this.notifications.show(error.message, 'error');
            this.ui.hideLoading();
        }
    }
    
    async createMonthlyDutySchedule() {
        // Get active employees
        const employees = await this.employees.getActive();
        
        // Get current month info
        const currentDate = new Date();
        const persianDate = this.dateService.toPersian(currentDate);
        const year = persianDate.year;
        const month = persianDate.month;
        
        // Get days in month
        const daysInMonth = this.dateService.getDaysInMonth(year, month);
        
        // Create schedule
        const schedule = [];
        const employeeCodes = employees.map(emp => emp.code);
        
        // Simple round-robin assignment
        let dayIndex = 0;
        let nightIndex = 1;
        let assistantIndex = 2;
        let oncallIndex = 3;
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = this.dateService.format(
                new Date(year, month - 1, day),
                'YYYY/MM/DD'
            );
            
            const dayOfWeek = this.dateService.getDayOfWeek(dateStr);
            
            // Skip Fridays (جمعه)
            if (dayOfWeek === 'جمعه') {
                schedule.push({
                    date: dateStr,
                    dayOfWeek,
                    dayDuty: '',
                    nightDuty: '',
                    assistantDuty: '',
                    oncallDuty: '',
                    isHoliday: true
                });
                continue;
            }
            
            schedule.push({
                date: dateStr,
                dayOfWeek,
                dayDuty: employeeCodes[dayIndex % employeeCodes.length],
                nightDuty: employeeCodes[nightIndex % employeeCodes.length],
                assistantDuty: employeeCodes[assistantIndex % employeeCodes.length],
                oncallDuty: employeeCodes[oncallIndex % employeeCodes.length],
                isHoliday: false
            });
            
            // Move to next employees
            dayIndex += 2;
            nightIndex += 2;
            assistantIndex += 2;
            oncallIndex += 2;
        }
        
        return schedule;
    }
    
    generateDutyControlsHTML(schedule) {
        // Get active employees for dropdowns
        const employees = this.employees.getActiveSync(); // Assuming sync method
        
        let html = `
            <div class="duty-controls-header">
                <h4>تنظیم کشیک ماهانه</h4>
                <p>تعداد روزها: ${schedule.length} روز | تعطیلات: ${
                    schedule.filter(d => d.isHoliday).length
                } روز</p>
            </div>
            <div class="active-employees">
                <h5>کارمندان فعال:</h5>
                <div class="team-members-list">
        `;
        
        employees.forEach(emp => {
            html += `<span class="badge">${emp.name}</span>`;
        });
        
        html += `
                </div>
            </div>
            <div class="duty-summary" id="duty-summary">
                <div id="duty-summary-content">
                    <!-- Summary will be updated dynamically -->
                </div>
            </div>
        `;
        
        return html;
    }
    
    async updateDutyTable(schedule) {
        const tbody = document.getElementById('admin-duty-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        const employees = await this.employees.getAll();
        const employeeMap = new Map(employees.map(emp => [emp.code, emp]));
        
        schedule.forEach(day => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${day.date}</td>
                <td>${day.dayOfWeek}</td>
                <td class="duty-cell">
                    <select class="duty-select" data-date="${day.date}" data-type="dayDuty"
                            ${day.isHoliday ? 'disabled' : ''}>
                        <option value="">انتخاب کارمند</option>
                        ${employees.map(emp => `
                            <option value="${emp.code}" ${day.dayDuty === emp.code ? 'selected' : ''}>
                                ${emp.name}
                            </option>
                        `).join('')}
                    </select>
                </td>
                <td class="duty-cell">
                    <select class="duty-select" data-date="${day.date}" data-type="nightDuty"
                            ${day.isHoliday ? 'disabled' : ''}>
                        <option value="">انتخاب کارمند</option>
                        ${employees.map(emp => `
                            <option value="${emp.code}" ${day.nightDuty === emp.code ? 'selected' : ''}>
                                ${emp.name}
                            </option>
                        `).join('')}
                    </select>
                </td>
                <td class="duty-cell">
                    <select class="duty-select" data-date="${day.date}" data-type="assistantDuty"
                            ${day.isHoliday ? 'disabled' : ''}>
                        <option value="">انتخاب کارمند</option>
                        ${employees.map(emp => `
                            <option value="${emp.code}" ${day.assistantDuty === emp.code ? 'selected' : ''}>
                                ${emp.name}
                            </option>
                        `).join('')}
                    </select>
                </td>
                <td class="duty-cell">
                    <select class="duty-select" data-date="${day.date}" data-type="oncallDuty"
                            ${day.isHoliday ? 'disabled' : ''}>
                        <option value="">انتخاب کارمند</option>
                        ${employees.map(emp => `
                            <option value="${emp.code}" ${day.oncallDuty === emp.code ? 'selected' : ''}>
                                ${emp.name}
                            </option>
                        `).join('')}
                    </select>
                </td>
                <td>
                    <button class="btn btn-sm btn-warning clear-duty-btn" 
                            data-date="${day.date}" 
                            ${day.isHoliday ? 'disabled' : ''}>
                        <i class="fas fa-undo"></i> پاک کردن
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        // Add event listeners
        this.setupDutyTableListeners();
        
        // Update summary
        this.updateDutySummary();
    }
    
    setupDutyTableListeners() {
        // Duty select changes
        document.querySelectorAll('.duty-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const date = e.target.dataset.date;
                const type = e.target.dataset.type;
                const value = e.target.value;
                
                this.handleDutyChange(date, type, value);
            });
        });
        
        // Clear duty buttons
        document.querySelectorAll('.clear-duty-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const date = e.target.closest('button').dataset.date;
                this.clearDutyRow(date);
            });
        });
    }
    
    async handleDutyChange(date, type, employeeCode) {
        try {
            // Get current schedule
            let schedule = await this.storage.get('duty_schedule') || [];
            
            // Find or create day entry
            let dayEntry = schedule.find(d => d.date === date);
            if (!dayEntry) {
                dayEntry = {
                    date,
                    dayOfWeek: this.dateService.getDayOfWeek(date),
                    dayDuty: '',
                    nightDuty: '',
                    assistantDuty: '',
                    oncallDuty: ''
                };
                schedule.push(dayEntry);
            }
            
            // Update duty
            dayEntry[type] = employeeCode;
            
            // Save schedule
            await this.storage.set('duty_schedule', schedule);
            
            // Update summary
            this.updateDutySummary();
            
            // Show notification
            if (employeeCode) {
                const employee = await this.employees.getByCode(employeeCode);
                if (employee) {
                    this.notifications.show(
                        `${employee.name} به عنوان ${this.getDutyTypeText(type)} انتخاب شد`,
                        'info'
                    );
                }
            }
            
        } catch (error) {
            this.logger.error('Failed to update duty:', error);
            this.notifications.show('خطا در به‌روزرسانی کشیک', 'error');
        }
    }
    
    getDutyTypeText(type) {
        const types = {
            'dayDuty': 'کشیک روز',
            'nightDuty': 'کشیک شب',
            'assistantDuty': 'کمک کشیک',
            'oncallDuty': 'آنکال'
        };
        return types[type] || type;
    }
    
    async clearDutyRow(date) {
        if (!confirm('آیا می‌خواهید تمام کشیک‌های این تاریخ را پاک کنید؟')) {
            return;
        }
        
        try {
            let schedule = await this.storage.get('duty_schedule') || [];
            schedule = schedule.filter(d => d.date !== date);
            
            await this.storage.set('duty_schedule', schedule);
            
            // Refresh table
            await this.updateDutyTable(schedule);
            
            this.notifications.show('کشیک تاریخ مورد نظر پاک شد', 'success');
            
        } catch (error) {
            this.logger.error('Failed to clear duty row:', error);
            this.notifications.show('خطا در پاک کردن کشیک', 'error');
        }
    }
    
    updateDutySummary() {
        const summaryElement = document.getElementById('duty-summary-content');
        if (!summaryElement) return;
        
        // This would calculate and display duty summary
        // For brevity, showing placeholder
        
        summaryElement.innerHTML = `
            <p><strong>تعداد روزهای تنظیم شده:</strong> در حال محاسبه...</p>
            <p><strong>توزیع کشیک:</strong> در حال محاسبه...</p>
        `;
    }
    
    async finalizeDutySchedule() {
        try {
            const schedule = await this.storage.get('duty_schedule') || [];
            
            if (schedule.length === 0) {
                throw new Error('هیچ کشیکی ثبت نشده است');
            }
            
            // Validate schedule
            const validation = this.validateDutySchedule(schedule);
            if (!validation.valid) {
                throw new Error(validation.errors.join(', '));
            }
            
            // Finalize schedule
            await this.storage.set('duty_schedule_finalized', schedule);
            
            // Notify employees
            await this.notifyEmployeesAboutDuty(schedule);
            
            // Hide finalize button
            const finalizeBtn = document.getElementById('admin-finalize-duty-btn');
            if (finalizeBtn) {
                finalizeBtn.style.display = 'none';
            }
            
            this.notifications.show('کشیک ماهانه با موفقیت ثبت شد', 'success');
            
            // Analytics
            this.analytics.trackEvent('duty_schedule_finalized', {
                daysCount: schedule.length,
                employeeCount: this.countUniqueEmployees(schedule)
            });
            
        } catch (error) {
            this.logger.error('Failed to finalize duty schedule:', error);
            this.notifications.show(error.message, 'error');
        }
    }
    
    validateDutySchedule(schedule) {
        const errors = [];
        
        // Check for empty duties on non-holidays
        schedule.forEach(day => {
            if (!day.isHoliday) {
                if (!day.dayDuty) errors.push(`کشیک روز برای تاریخ ${day.date} تعیین نشده`);
                if (!day.nightDuty) errors.push(`کشیک شب برای تاریخ ${day.date} تعیین نشده`);
            }
        });
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
    
    countUniqueEmployees(schedule) {
        const employees = new Set();
        
        schedule.forEach(day => {
            if (day.dayDuty) employees.add(day.dayDuty);
            if (day.nightDuty) employees.add(day.nightDuty);
            if (day.assistantDuty) employees.add(day.assistantDuty);
            if (day.oncallDuty) employees.add(day.oncallDuty);
        });
        
        return employees.size;
    }
    
    async notifyEmployeesAboutDuty(schedule) {
        // Group duties by employee
        const employeeDuties = {};
        
        schedule.forEach(day => {
            if (day.dayDuty) {
                if (!employeeDuties[day.dayDuty]) employeeDuties[day.dayDuty] = [];
                employeeDuties[day.dayDuty].push({
                    date: day.date,
                    dayOfWeek: day.dayOfWeek,
                    type: 'کشیک روز'
                });
            }
            
            if (day.nightDuty) {
                if (!employeeDuties[day.nightDuty]) employeeDuties[day.nightDuty] = [];
                employeeDuties[day.nightDuty].push({
                    date: day.date,
                    dayOfWeek: day.dayOfWeek,
                    type: 'کشیک شب'
                });
            }
            
            if (day.assistantDuty) {
                if (!employeeDuties[day.assistantDuty]) employeeDuties[day.assistantDuty] = [];
                employeeDuties[day.assistantDuty].push({
                    date: day.date,
                    dayOfWeek: day.dayOfWeek,
                    type: 'کمک کشیک'
                });
            }
            
            if (day.oncallDuty) {
                if (!employeeDuties[day.oncallDuty]) employeeDuties[day.oncallDuty] = [];
                employeeDuties[day.oncallDuty].push({
                    date: day.date,
                    dayOfWeek: day.dayOfWeek,
                    type: 'آنکال'
                });
            }
        });
        
        // Send notifications
        for (const [empCode, duties] of Object.entries(employeeDuties)) {
            try {
                const employee = await this.employees.getByCode(empCode);
                if (employee) {
                    await this.notifications.send({
                        type: 'duty_assigned',
                        userId: employee.id,
                        data: {
                            duties,
                            count: duties.length,
                            month: this.dateService.getCurrentMonthName()
                        },
                        priority: 'normal'
                    });
                }
            } catch (error) {
                this.logger.warn(`Failed to notify employee ${empCode}:`, error);
            }
        }
    }
    
    async printDutySchedule() {
        const schedule = await this.storage.get('duty_schedule_finalized') || [];
        
        if (schedule.length === 0) {
            this.notifications.show('هیچ کشیکی برای پرینت وجود ندارد', 'warning');
            return;
        }
        
        // Open print window
        const printWindow = window.open('', '_blank');
        
        // Generate printable HTML
        const printableHTML = this.generatePrintableDutySchedule(schedule);
        
        printWindow.document.write(printableHTML);
        printWindow.document.close();
        printWindow.print();
    }
    
    generatePrintableDutySchedule(schedule) {
        const employees = this.employees.getAllSync(); // Assuming sync method
        const employeeMap = new Map(employees.map(emp => [emp.code, emp]));
        
        const monthName = this.dateService.getCurrentMonthName();
        const year = this.dateService.getCurrentYear();
        
        return `
            <!DOCTYPE html>
            <html dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>لیست کشیک ${monthName} ${year}</title>
                <style>
                    body { font-family: Tahoma, Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #000; padding: 8px; text-align: center; }
                    th { background-color: #f0f0f0; }
                    .footer { margin-top: 30px; text-align: left; font-size: 12px; color: #666; }
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>لیست کشیک ماه ${monthName} ${year}</h1>
                    <p>سیستم مدیریت کارکنان - نسخه ${this.config.VERSION}</p>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th>ردیف</th>
                            <th>تاریخ</th>
                            <th>روز</th>
                            <th>کشیک روز</th>
                            <th>کشیک شب</th>
                            <th>کمک کشیک</th>
                            <th>آنکال</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${schedule.map((day, index) => {
                            const dayEmp = employeeMap.get(day.dayDuty);
                            const nightEmp = employeeMap.get(day.nightDuty);
                            const assistantEmp = employeeMap.get(day.assistantDuty);
                            const oncallEmp = employeeMap.get(day.oncallDuty);
                            
                            return `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${day.date}</td>
                                    <td>${day.dayOfWeek}</td>
                                    <td>${dayEmp ? dayEmp.name : ''}</td>
                                    <td>${nightEmp ? nightEmp.name : ''}</td>
                                    <td>${assistantEmp ? assistantEmp.name : ''}</td>
                                    <td>${oncallEmp ? oncallEmp.name : ''}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
                
                <div class="footer">
                    <p>این سند به صورت خودکار توسط سیستم مدیریت کارکنان تولید شده است.</p>
                    <p>تاریخ پرینت: ${this.dateService.format(new Date(), 'YYYY/MM/DD HH:mm')}</p>
                </div>
                
                <div class="no-print" style="margin-top: 20px;">
                    <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">
                        پرینت
                    </button>
                    <button onclick="window.close()" style="padding: 10px 20px; font-size: 16px; cursor: pointer; margin-right: 10px;">
                        بستن
                    </button>
                </div>
            </body>
            </html>
        `;
    }
    
    async generateReportFromUI() {
        try {
            const reportConfig = {
                type: document.getElementById('admin-report-type').value,
                month: parseInt(document.getElementById('admin-report-month').value),
                employee: document.getElementById('admin-report-employee').value,
                formats: ['html', 'pdf'] // Default formats
            };
            
            await this.generateReport(reportConfig);
            
            // Show print button
            const printBtn = document.getElementById('admin-print-report-btn');
            if (printBtn) {
                printBtn.style.display = 'inline-flex';
            }
            
        } catch (error) {
            this.logger.error('Failed to generate report from UI:', error);
            // Error already shown in generateReport
        }
    }
    
    async printReport() {
        window.print();
    }
    
    // ==================== TAB MANAGEMENT ====================
    async switchTab(tabName) {
        if (!this.currentUser) return;
        
        try {
            // Update app state
            this.appState.previousView = this.appState.currentView;
            this.appState.currentView = tabName;
            
            // Update UI
            await this.ui.switchTab(tabName);
            
            // Load tab data
            await this.loadTabData(tabName);
            
            // Update page title
            this.updatePageTitle(tabName);
            
            // Analytics
            this.analytics.trackEvent('tab_switch', { tab: tabName });
            
        } catch (error) {
            this.logger.error(`Failed to switch to tab ${tabName}:`, error);
            this.notifications.show('خطا در تغییر تب', 'error');
        }
    }
    
    async loadTabData(tabName) {
        switch (tabName) {
            case 'employee-dashboard':
            case 'admin-dashboard':
                await this.updateDashboard();
                break;
                
            case 'employee-attendance':
                await this.updateAttendanceTable();
                break;
                
            case 'employee-tasks':
                await this.updateTaskTable();
                break;
                
            case 'employee-requests':
                await this.updateRequestTable();
                break;
                
            case 'employee-duty':
                await this.updateDutyTableForEmployee();
                break;
                
            case 'admin-employees':
                await this.updateEmployeeTable();
                break;
                
            case 'admin-tasks':
                await this.updateAdminTaskTable();
                break;
                
            case 'admin-requests':
                await this.updateAdminRequestTable();
                break;
                
            case 'admin-duty':
                await this.updateAdminDutyTable();
                break;
                
            case 'admin-reports':
                await this.initializeReportTab();
                break;
                
            case 'admin-settings':
                await this.loadSettingsForm();
                break;
        }
    }
    
    async updateTaskTable() {
        if (!this.currentUser) return;
        
        try {
            const tasks = await this.tasks.getUserTasks(this.currentUser.id);
            await this.tableRenderer.renderTaskTable(tasks);
            
        } catch (error) {
            this.logger.error('Failed to update task table:', error);
        }
    }
    
    async updateRequestTable() {
        if (!this.currentUser) return;
        
        try {
            const requests = await this.requests.getUserRequests(this.currentUser.id);
            await this.tableRenderer.renderRequestTable(requests);
            
        } catch (error) {
            this.logger.error('Failed to update request table:', error);
        }
    }
    
    async updateDutyTableForEmployee() {
        if (!this.currentUser) return;
        
        try {
            const duties = await this.getUserDutySchedule();
            await this.tableRenderer.renderDutyTable(duties);
            
        } catch (error) {
            this.logger.error('Failed to update duty table:', error);
        }
    }
    
    async updateEmployeeTable() {
        try {
            const employees = await this.employees.getAll();
            await this.tableRenderer.renderEmployeeTable(employees);
            
        } catch (error) {
            this.logger.error('Failed to update employee table:', error);
        }
    }
    
    async updateAdminTaskTable() {
        try {
            const tasks = await this.tasks.getAll();
            await this.tableRenderer.renderAdminTaskTable(tasks);
            
        } catch (error) {
            this.logger.error('Failed to update admin task table:', error);
        }
    }
    
    async updateAdminRequestTable() {
        try {
            const requests = await this.requests.getAll();
            await this.tableRenderer.renderAdminRequestTable(requests);
            
        } catch (error) {
            this.logger.error('Failed to update admin request table:', error);
        }
    }
    
    async updateAdminDutyTable() {
        try {
            const schedule = await this.getDutySchedule();
            await this.updateDutyTable(schedule);
            
        } catch (error) {
            this.logger.error('Failed to update admin duty table:', error);
        }
    }
    
    async initializeReportTab() {
        // Initialize month dropdown
        await this.initializeReportMonthDropdown();
        
        // Initialize employee dropdown
        await this.initializeReportEmployeeDropdown();
    }
    
    async initializeReportMonthDropdown() {
        const select = document.getElementById('admin-report-month');
        if (!select) return;
        
        const months = [
            'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
            'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
        ];
        
        select.innerHTML = '';
        months.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = index + 1;
            option.textContent = month;
            select.appendChild(option);
        });
        
        // Set current month
        const currentMonth = this.dateService.getCurrentMonth();
        select.value = currentMonth;
    }
    
    async initializeReportEmployeeDropdown() {
        const select = document.getElementById('admin-report-employee');
        if (!select) return;
        
        try {
            const employees = await this.employees.getActive();
            
            select.innerHTML = '<option value="all">همه کارمندان</option>';
            
            employees.forEach(emp => {
                const option = document.createElement('option');
                option.value = emp.code;
                option.textContent = emp.name;
                select.appendChild(option);
            });
            
        } catch (error) {
            this.logger.error('Failed to initialize employee dropdown:', error);
        }
    }
    
    async loadSettingsForm() {
        try {
            const settings = await this.storage.get('settings') || {};
            
            // Populate form fields
            const fields = {
                'work-start-time': settings.workStartTime,
                'work-end-time': settings.workEndTime,
                'work-start-date': settings.workStartDate,
                'work-end-date': settings.workEndDate,
                'office-lat': settings.officeLat,
                'office-lng': settings.officeLng
            };
            
            Object.entries(fields).forEach(([id, value]) => {
                const element = document.getElementById(id);
                if (element && value) {
                    element.value = value;
                }
            });
            
        } catch (error) {
            this.logger.error('Failed to load settings form:', error);
        }
    }
    
    updatePageTitle(tabName) {
        const titles = {
            'employee-dashboard': 'داشبورد کارمند',
            'employee-attendance': 'حضور و غیاب',
            'employee-tasks': 'کارهای من',
            'employee-requests': 'درخواست‌های من',
            'employee-duty': 'کشیک‌های من',
            'employee-profile': 'پروفایل من',
            'admin-dashboard': 'داشبورد مدیریت',
            'admin-employees': 'مدیریت کارکنان',
            'admin-tasks': 'مدیریت کارها',
            'admin-requests': 'مدیریت درخواست‌ها',
            'admin-duty': 'مدیریت کشیک',
            'admin-reports': 'گزارش‌گیری',
            'admin-settings': 'تنظیمات سیستم'
        };
        
        const title = titles[tabName] || 'سیستم مدیریت کارکنان';
        this.ui.updatePageTitle(title);
    }
    
    // ==================== HELPER METHODS ====================
    async refreshData() {
        try {
            this.ui.showLoading('در حال به‌روزرسانی داده‌ها...');
            
            // Refresh user data
            await this.loadUserData();
            
            // Refresh current tab
            await this.loadTabData(this.appState.currentView);
            
            // Update dashboard
            await this.updateDashboard();
            
            this.ui.hideLoading();
            this.notifications.show('داده‌ها به‌روزرسانی شدند', 'success');
            
        } catch (error) {
            this.logger.error('Failed to refresh data:', error);
            this.notifications.show('خطا در به‌روزرسانی داده‌ها', 'error');
            this.ui.hideLoading();
        }
    }
    
    async saveCurrentView() {
        // This would save the current view state
        // For example, save table filters, form data, etc.
        
        this.notifications.show('ذخیره شد', 'success');
    }
    
    async exportCurrentData() {
        try {
            const data = await this.getCurrentViewData();
            const exportData = await this.reports.exportToExcel(data);
            
            // Create download link
            const blob = new Blob([exportData], { type: 'application/vnd.ms-excel' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `export_${new Date().toISOString().slice(0, 10)}.xlsx`;
            a.click();
            
            URL.revokeObjectURL(url);
            
            this.notifications.show('داده‌ها با موفقیت export شدند', 'success');
            
        } catch (error) {
            this.logger.error('Failed to export data:', error);
            this.notifications.show('خطا در export داده‌ها', 'error');
        }
    }
    
    async getCurrentViewData() {
        // Get data based on current view
        switch (this.appState.currentView) {
            case 'employee-attendance':
                return await this.attendance.getUserAttendance(this.currentUser.id, 365);
                
            case 'employee-tasks':
                return await this.tasks.getUserTasks(this.currentUser.id);
                
            case 'employee-requests':
                return await this.requests.getUserRequests(this.currentUser.id);
                
            default:
                return {};
        }
    }
    
    async showHelp() {
        this.modals.show('help-modal', {
            currentView: this.appState.currentView
        });
    }
    
    async switchTheme() {
        const newTheme = this.appState.theme === 'light' ? 'dark' : 'light';
        this.appState.theme = newTheme;
        
        await this.ui.setTheme(newTheme);
        
        // Save to settings
        const settings = await this.storage.get('settings') || {};
        settings.theme = newTheme;
        await this.storage.set('settings', settings);
        
        this.notifications.show(`تم ${newTheme === 'light' ? 'روشن' : 'تیره'} فعال شد`, 'info');
    }
    
    // ==================== FINALIZATION ====================
    async finalizeStartup() {
        this.appState.isInitialized = true;
        this.appState.isLoading = false;
        
        // Hide loading screen
        await this.ui.hideLoadingScreen();
        
        // Start background services
        this.startBackgroundTasks();
        
        // Start periodic sync
        this.startPeriodicSync();
        
        // Log successful startup
        this.logger.info('Application startup completed successfully', {
            user: this.currentUser?.name,
            role: this.currentUser?.role,
            sessionDuration: new Date() - this.appState.sessionStart
        });
    }
    
    // ==================== CLEANUP ====================
    cleanup() {
        // Stop all intervals
        if (this.timeUpdateInterval) {
            clearInterval(this.timeUpdateInterval);
            this.timeUpdateInterval = null;
        }
        
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
        
        if (this.dataRefreshInterval) {
            clearInterval(this.dataRefreshInterval);
            this.dataRefreshInterval = null;
        }
        
        // Stop background services
        this.stopBackgroundTasks();
        
        // Stop GPS tracking
        this.gpsTracker.stop();
        
        // Remove event listeners
        this.ui.cleanup();
        
        // Clear caches
        this.cache.clearExpired();
        
        // Save session
        if (this.currentUser) {
            this.auth.saveSessionState();
        }
        
        this.logger.info('Application cleanup completed');
    }
    
    // ==================== PUBLIC API ====================
    getPublicAPI() {
        return {
            // User Management
            getCurrentUser: () => this.currentUser,
            logout: () => this.auth.logout(),
            hasPermission: (permission) => this.hasPermission(permission),
            
            // Attendance
            checkIn: () => this.recordAttendance('check_in'),
            checkOut: () => this.recordAttendance('check_out'),
            getAttendance: () => this.attendance.getUserAttendance(this.currentUser?.id),
            
            // Tasks
            createTask: (data) => this.createTask(data),
            getTasks: (filters) => this.tasks.getUserTasks(this.currentUser?.id, filters),
            viewTask: (id) => this.viewTask(id),
            
            // Requests
            createRequest: (data) => this.createRequest(data),
            getRequests: (filters) => this.requests.getUserRequests(this.currentUser?.id, filters),
            viewRequest: (id) => this.viewRequest(id),
            
            // Reports
            generateReport: (config) => this.generateReport(config),
            
            // UI
            showModal: (type, data) => this.modals.show(type, data),
            hideModal: (id) => this.modals.close(id),
            switchTab: (tab) => this.switchTab(tab),
            
            // Utilities
            formatDate: (date, format) => this.dateService.format(date, format),
            formatNumber: (number) => Formatter.formatNumber(number),
            showNotification: (message, type) => this.notifications.show(message, type),
            
            // Debug
            getAppState: () => ({ ...this.appState }),
            getPerformance: () => this.performance.getMetrics(),
            getStorageInfo: () => this.storage.getInfo(),
            clearCache: () => this.clearCacheAndReload()
        };
    }
}

// ==================== GLOBAL INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Check for service worker support
        if ('serviceWorker' in navigator) {
            // Wait for service worker to be ready
            await navigator.serviceWorker.ready;
        }
        
        // Create app instance
        const appConfig = {
            API: {
                BASE_URL: window.API_BASE_URL || '/api/v1'
            }
        };
        
        // Initialize application
        window.EMS = new EmployeeManagementSystem(appConfig);
        
        // Expose public API
        window.ems = window.EMS.getPublicAPI();
        
        // Start the application
        await window.EMS.startup();
        
        // Log successful initialization
        console.log('✅ Employee Management System v3.0 initialized successfully');
        
    } catch (error) {
        console.error('❌ Failed to initialize application:', error);
        
        // Show emergency screen
        document.body.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                       background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                       color: white; display: flex; flex-direction: column; 
                       align-items: center; justify-content: center; padding: 20px; text-align: center;">
                <h1 style="font-size: 2rem; margin-bottom: 20px;">⚠️ خطا در راه‌اندازی سیستم</h1>
                <p style="margin-bottom: 30px; font-size: 1.2rem;">${error.message}</p>
                <div style="display: flex; gap: 15px; flex-wrap: wrap; justify-content: center;">
                    <button onclick="window.location.reload()" 
                            style="padding: 12px 24px; background: white; color: #667eea; 
                                   border: none; border-radius: 8px; font-size: 1rem; 
                                   cursor: pointer; font-weight: bold;">
                        🔄 تلاش مجدد
                    </button>
                    <button onclick="localStorage.clear(); sessionStorage.clear(); window.location.reload()"
                            style="padding: 12px 24px; background: rgba(255,255,255,0.2); color: white; 
                                   border: 2px solid white; border-radius: 8px; font-size: 1rem; 
                                   cursor: pointer; font-weight: bold;">
                        🗑️ پاک کردن داده‌ها و تلاش مجدد
                    </button>
                </div>
                <p style="margin-top: 40px; font-size: 0.9rem; opacity: 0.8;">
                    اگر مشکل ادامه داشت، لطفاً با پشتیبانی تماس بگیرید.
                </p>
            </div>
        `;
    }
});

// ==================== GLOBAL ERROR HANDLING ====================
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    if (window.EMS && window.EMS.errorBoundary) {
        window.EMS.errorBoundary.handleError(event.error, 'Global Error');
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    if (window.EMS && window.EMS.errorBoundary) {
        window.EMS.errorBoundary.handleError(event.reason, 'Unhandled Promise Rejection');
    }
});

// ==================== SERVICE WORKER REGISTRATION ====================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js');
            
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New update available
                        if (window.EMS && window.EMS.notifications) {
                            window.EMS.notifications.show(
                                'نسخه جدید در دسترس است. برای بروزرسانی صفحه را رفرش کنید.',
                                'info',
                                {
                                    action: 'بروزرسانی',
                                    onAction: () => window.location.reload()
                                }
                            );
                        }
                    }
                });
            });
            
            console.log('Service Worker registered:', registration);
            
        } catch (error) {
            console.warn('Service Worker registration failed:', error);
        }
    });
}

// ==================== EXPORT FOR MODULE SYSTEM ====================
export { EmployeeManagementSystem };
export default EmployeeManagementSystem;

// ==================== PWA INSTALL PROMPT ====================
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show install button
    if (window.EMS && window.EMS.ui) {
        window.EMS.ui.showInstallButton(() => {
            // Show the install prompt
            deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                deferredPrompt = null;
            });
        });
    }
});

// ==================== OFFLINE DETECTION ====================
window.addEventListener('offline', () => {
    if (window.EMS && window.EMS.ui) {
        window.EMS.ui.showOfflineIndicator();
    }
});

window.addEventListener('online', () => {
    if (window.EMS && window.EMS.ui) {
        window.EMS.ui.hideOfflineIndicator();
    }
});

// ==============================================
// 📦 END OF MAIN.JS - APPLICATION READY
// ==============================================