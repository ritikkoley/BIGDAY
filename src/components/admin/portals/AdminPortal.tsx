@@ .. @@
                <button
                  onClick={() => handleTabChange('settings')}
                  className={`apple-nav-button ${
                    activeTab === 'settings' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  }`}
                >
                  Settings
                </button>
+                <button
+                  onClick={() => handleTabChange('allocation')}
+                  className={`apple-nav-button ${
+                    activeTab === 'allocation' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
+                  }`}
+                >
+                  Allocation
+                </button>
              </div>