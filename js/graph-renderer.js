// Graph Renderer Module
// Centralized utilities for rendering graphs and charts in questions
// Supports function-plot (for function graphs) and Chart.js (for statistical charts)

window.GraphRenderer = {
    // Track generated IDs to avoid collisions
    _generatedIds: new Set(),
    
    // Generate a unique ID for graph/chart containers
    generateId: function(prefix = 'graph') {
        let id;
        do {
            id = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
        } while (this._generatedIds.has(id));
        this._generatedIds.add(id);
        return id;
    },
    
    // Clear the graph container
    clearContainer: function() {
        const container = document.getElementById('graph-container');
        if (container) {
            container.innerHTML = '';
            container.classList.add('hidden');
            container.classList.remove('visible');
        }
        // Clear tracked IDs
        this._generatedIds.clear();
    },
    
    // Show the graph container
    showContainer: function() {
        const container = document.getElementById('graph-container');
        if (container) {
            container.classList.remove('hidden');
            container.classList.add('visible');
        }
    },
    
    // Render a single function graph using function-plot
    renderFunctionPlot: function(functions, options = {}) {
        const graphId = this.generateId('function-plot');
        const width = options.width || 400;
        const height = options.height || 300;
        const xDomain = options.xDomain || [-5, 5];
        const yDomain = options.yDomain || [-5, 5];
        
        const container = document.getElementById('graph-container');
        if (!container) {
            console.error('Graph container not found');
            return null;
        }
        
        // Create wrapper div for single graph
        const wrapper = document.createElement('div');
        wrapper.className = 'single-graph';
        wrapper.innerHTML = `<div id="${graphId}" style="width: 100%; max-width: ${width}px; height: ${height}px; margin: 0 auto;"></div>`;
        container.appendChild(wrapper);
        
        this.showContainer();
        
        // Render graph after a short delay to ensure DOM is ready
        setTimeout(() => {
            if (typeof functionPlot === 'undefined') {
                console.warn('function-plot library not loaded yet');
                wrapper.innerHTML = '<div class="text-gray-400 text-center p-4">Graph library loading...</div>';
                return;
            }
            
            try {
                functionPlot({
                    target: `#${graphId}`,
                    width: Math.min(width, wrapper.offsetWidth),
                    height: height,
                    xAxis: { domain: xDomain },
                    yAxis: { domain: yDomain },
                    grid: true,
                    data: functions
                });
            } catch (e) {
                console.error('Error rendering function plot:', e);
                wrapper.innerHTML = '<div class="text-red-400 text-center p-4">Error rendering graph</div>';
            }
        }, 100);
        
        return graphId;
    },
    
    // Render a chart using Chart.js
    renderChart: function(type, data, options = {}) {
        const chartId = this.generateId('chart');
        const width = options.width || 400;
        const height = options.height || 300;
        
        const container = document.getElementById('graph-container');
        if (!container) {
            console.error('Graph container not found');
            return null;
        }
        
        // Create wrapper div for single chart
        const wrapper = document.createElement('div');
        wrapper.className = 'single-graph';
        wrapper.innerHTML = `
            <div style="width: 100%; max-width: ${width}px; height: ${height}px; margin: 0 auto; position: relative;">
                <canvas id="${chartId}"></canvas>
            </div>
        `;
        container.appendChild(wrapper);
        
        this.showContainer();
        
        // Render chart after a short delay to ensure DOM is ready
        setTimeout(() => {
            if (typeof Chart === 'undefined') {
                console.warn('Chart.js library not loaded yet');
                wrapper.innerHTML = '<div class="text-gray-400 text-center p-4">Chart library loading...</div>';
                return;
            }
            
            try {
                const canvas = document.getElementById(chartId);
                if (!canvas) {
                    console.error('Canvas element not found:', chartId);
                    return;
                }
                
                const ctx = canvas.getContext('2d');
                new Chart(ctx, {
                    type: type,
                    data: data,
                    options: options.chartOptions || {
                        responsive: true,
                        maintainAspectRatio: true
                    }
                });
            } catch (e) {
                console.error('Error rendering chart:', e);
                wrapper.innerHTML = '<div class="text-red-400 text-center p-4">Error rendering chart</div>';
            }
        }, 100);
        
        return chartId;
    },
    
    // Render multiple graphs as answer choices (for MC questions)
    // Each graph option should have: { label, type, data, options }
    renderGraphChoices: function(graphOptions, onSelect) {
        const container = document.getElementById('graph-container');
        if (!container) {
            console.error('Graph container not found');
            return;
        }
        
        // Create grid wrapper
        const grid = document.createElement('div');
        grid.className = 'graph-grid';
        
        graphOptions.forEach((option, index) => {
            const choiceId = this.generateId('graph-choice');
            const graphId = this.generateId('graph');
            
            const choice = document.createElement('div');
            choice.className = 'graph-choice';
            choice.setAttribute('data-choice-index', index);
            choice.innerHTML = `
                <div class="graph-choice-label">${option.label}</div>
                <div id="${graphId}" style="width: 100%; height: 200px;"></div>
            `;
            
            choice.addEventListener('click', () => {
                // Remove selected class from all choices
                grid.querySelectorAll('.graph-choice').forEach(c => c.classList.remove('selected'));
                // Add selected class to clicked choice
                choice.classList.add('selected');
                // Call callback with selected index and label
                if (onSelect) {
                    onSelect(index, option.label);
                }
            });
            
            grid.appendChild(choice);
            
            // Render the graph/chart inside this choice
            setTimeout(() => {
                if (option.type === 'function') {
                    this._renderFunctionInContainer(graphId, option.functions, option.options);
                } else if (option.type === 'chart') {
                    this._renderChartInContainer(graphId, option.chartType, option.data, option.options);
                }
            }, 150 + index * 50); // Stagger rendering to avoid UI blocking
        });
        
        container.appendChild(grid);
        this.showContainer();
    },
    
    // Helper: Render function plot in a specific container
    _renderFunctionInContainer: function(containerId, functions, options = {}) {
        const element = document.getElementById(containerId);
        if (!element || typeof functionPlot === 'undefined') {
            return;
        }
        
        try {
            functionPlot({
                target: `#${containerId}`,
                width: element.offsetWidth,
                height: element.offsetHeight,
                xAxis: { domain: options.xDomain || [-5, 5] },
                yAxis: { domain: options.yDomain || [-5, 5] },
                grid: true,
                data: functions
            });
        } catch (e) {
            console.error('Error rendering function in container:', e);
            element.innerHTML = '<div class="text-red-400 text-xs text-center p-2">Error</div>';
        }
    },
    
    // Helper: Render chart in a specific container
    _renderChartInContainer: function(containerId, chartType, data, options = {}) {
        const element = document.getElementById(containerId);
        if (!element || typeof Chart === 'undefined') {
            return;
        }
        
        try {
            // Create canvas element
            const canvas = document.createElement('canvas');
            element.appendChild(canvas);
            
            const ctx = canvas.getContext('2d');
            new Chart(ctx, {
                type: chartType,
                data: data,
                options: options.chartOptions || {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        } catch (e) {
            console.error('Error rendering chart in container:', e);
            element.innerHTML = '<div class="text-red-400 text-xs text-center p-2">Error</div>';
        }
    },
    
    // Check if graph libraries are loaded
    checkLibrariesLoaded: function() {
        return {
            functionPlot: typeof functionPlot !== 'undefined',
            chartJs: typeof Chart !== 'undefined'
        };
    }
};
