// Facility Types Data
const facilityTypes = [
    {
        name: "Fulfillment Center",
        code: "FC",
        icon: "fa-warehouse",
        description: "Our flagship warehouses where customer orders are processed.",
        details: [
            "Pick, pack, and ship customer orders",
            "Use advanced technology and robotics",
            "Work in a fast-paced environment",
            "Be part of a dynamic team"
        ],
        requirements: [
            "Must be 18 years or older",
            "Ability to lift up to 49 pounds",
            "Stand/walk for 10-12 hours",
            "Basic English proficiency"
        ],
        benefits: [
            "Competitive pay",
            "Health insurance from day one",
            "401(k) with company match",
            "Career advancement opportunities"
        ],
        roles: [
            {
                title: "Warehouse Associate",
                payRange: "$16-$22/hour",
                shifts: ["Day", "Night", "Weekend", "Flex"]
            },
            {
                title: "Warehouse Team Lead",
                payRange: "$19-$25/hour",
                shifts: ["Day", "Night"]
            }
        ]
    },
    {
        name: "Sort Center",
        code: "SC",
        icon: "fa-sort",
        description: "Facilities that sort packages by zip code for efficient delivery.",
        details: [
            "Sort packages by destination",
            "Scan and route packages",
            "Work with automated systems",
            "Ensure accurate sorting"
        ],
        requirements: [
            "Must be 18 years or older",
            "Ability to lift up to 25 pounds",
            "Stand/walk for 8-10 hours",
            "Basic English proficiency"
        ],
        benefits: [
            "Competitive pay",
            "Health insurance options",
            "401(k) savings plan",
            "Flexible scheduling options"
        ],
        roles: [
            {
                title: "Sort Associate",
                payRange: "$15-$20/hour",
                shifts: ["Day", "Twilight", "Night"]
            }
        ]
    },
    {
        name: "Delivery Station",
        code: "DS",
        icon: "fa-truck",
        description: "Last-mile facilities where packages are sorted for final delivery.",
        details: [
            "Prepare packages for delivery routes",
            "Load delivery vehicles",
            "Scan and organize packages",
            "Work in early morning hours"
        ],
        requirements: [
            "Must be 18 years or older",
            "Ability to lift up to 35 pounds",
            "Stand/walk for 8-10 hours",
            "Valid driver's license (for some positions)"
        ],
        benefits: [
            "Competitive pay",
            "Health benefits",
            "PTO and paid holidays",
            "Employee discounts"
        ],
        roles: [
            {
                title: "Warehouse Associate",
                payRange: "$15-$21/hour",
                shifts: ["Early Morning", "Day", "Evening"]
            },
            {
                title: "Driver Trainer",
                payRange: "$18-$24/hour",
                shifts: ["Day"]
            }
        ]
    },
    {
        name: "Air Hub",
        code: "AH",
        icon: "fa-plane",
        description: "Aviation facilities handling Amazon Air operations.",
        details: [
            "Handle air freight operations",
            "Load and unload aircraft",
            "Operate specialized equipment",
            "Work with time-sensitive shipments"
        ],
        requirements: [
            "Must be 18 years or older",
            "Ability to lift up to 50 pounds",
            "Work in all weather conditions",
            "Valid airport security clearance"
        ],
        benefits: [
            "Premium pay rates",
            "Comprehensive health coverage",
            "Flight benefits (select locations)",
            "Career growth opportunities"
        ],
        roles: [
            {
                title: "Ramp Agent",
                payRange: "$18-$25/hour",
                shifts: ["Day", "Night", "Weekend"]
            },
            {
                title: "Load Planner",
                payRange: "$22-$28/hour",
                shifts: ["Day", "Night"]
            }
        ]
    }
];

// Facilities Functions
function initializeFacilities() {
    const container = document.getElementById('facilitiesGrid');
    if (!container) return;

    container.innerHTML = facilityTypes.map(facility => `
        <div class="facility-card card">
            <div class="facility-header">
                <i class="fas ${facility.icon}"></i>
                <h3>${facility.name} (${facility.code})</h3>
            </div>
            <p class="facility-description">${facility.description}</p>
            <button class="button-primary" onclick="toggleFacilityDetails(this)">Learn More</button>
            <div class="facility-details" style="display: none;">
                <div class="details-section">
                    <h4>What You'll Do:</h4>
                    <ul>
                        ${facility.details.map(detail => `<li>${detail}</li>`).join('')}
                    </ul>
                </div>
                <div class="details-section">
                    <h4>Requirements:</h4>
                    <ul>
                        ${facility.requirements.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                </div>
                <div class="details-section">
                    <h4>Benefits:</h4>
                    <ul>
                        ${facility.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                    </ul>
                </div>
                <div class="details-section">
                    <h4>Available Roles:</h4>
                    ${facility.roles.map(role => `
                        <div class="role-card">
                            <h5>${role.title}</h5>
                            <p>Pay Range: ${role.payRange}</p>
                            <p>Shifts: ${role.shifts.join(', ')}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function toggleFacilityDetails(button) {
    const details = button.nextElementSibling;
    const isHidden = details.style.display === 'none';

    details.style.display = isHidden ? 'block' : 'none';
    button.textContent = isHidden ? 'Show Less' : 'Learn More';
}

// Export for other modules
window.facilityTypes = facilityTypes;
window.initializeFacilities = initializeFacilities;
window.toggleFacilityDetails = toggleFacilityDetails;
