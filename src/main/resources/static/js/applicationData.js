// Application Steps Data
const applicationSteps = [
    {
        title: "Choose Your Role and Shift",
        icon: "fa-clock",
        description: "Select your preferred position and schedule.",
        details: [
            "Browse available positions in your area",
            "Review different shift patterns",
            "Compare pay rates and benefits",
            "Select your preferred location"
        ],
        tips: [
            "Consider your schedule and commute time",
            "Check multiple locations for more options",
            "Look at different shift patterns for better flexibility"
        ],
        duration: "5-10 minutes"
    },
    {
        title: "Create Your Account",
        icon: "fa-user-plus",
        description: "Set up your Amazon jobs profile.",
        details: [
            "Provide basic contact information",
            "Create a secure password",
            "Verify your email address",
            "Review account settings"
        ],
        tips: [
            "Use an email you check regularly",
            "Keep your login information secure",
            "Make sure your contact info is accurate"
        ],
        duration: "5 minutes"
    }
];

// Facility Types Data
const facilityTypes = [
    {
        name: "Fulfillment Center",
        code: "FC",
        icon: "fa-box",
        description: "Our flagship warehouses where customer orders are processed.",
        details: [
            "Pick, pack, and ship customer orders",
            "Use advanced technology and equipment",
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
        ]
    }
];

// Application Guide Functions
function initializeApplicationGuide() {
    const container = document.getElementById('guideSteps');
    if (!container) return;

    container.innerHTML = applicationSteps.map((step, index) => `
        <div class="guide-step card" onclick="toggleStepDetails(${index})">
            <div class="step-header">
                <h3><i class="fas ${step.icon}"></i> Step ${index + 1}: ${step.title}</h3>
                <span class="duration"><i class="fas fa-clock"></i> ${step.duration}</span>
            </div>
            <p class="step-description">${step.description}</p>
            <div class="step-content" id="step-${index}">
                <div class="details-section">
                    <h4>What to Expect:</h4>
                    <ul>
                        ${step.details.map(detail => `<li>${detail}</li>`).join('')}
                    </ul>
                </div>
                <div class="tips-section">
                    <h4>Pro Tips:</h4>
                    <ul>
                        ${step.tips.map(tip => `<li><i class="fas fa-lightbulb"></i> ${tip}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `).join('');
}

function toggleStepDetails(index) {
    const content = document.getElementById(`step-${index}`);
    const allContents = document.querySelectorAll('.step-content');

    allContents.forEach(item => {
        if (item !== content) {
            item.classList.remove('active');
        }
    });

    content.classList.toggle('active');
    updateProgress('applicationGuide', 15);
}

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
            </div>
        </div>
    `).join('');
}

function toggleFacilityDetails(button) {
    const details = button.nextElementSibling;
    const isHidden = details.style.display === 'none';

    details.style.display = isHidden ? 'block' : 'none';
    button.textContent = isHidden ? 'Show Less' : 'Learn More';

    if (isHidden) {
        updateProgress('jobTypes', 20);
    }
}

// Export for other modules
window.applicationSteps = applicationSteps;
window.facilityTypes = facilityTypes;
window.initializeApplicationGuide = initializeApplicationGuide;
window.initializeFacilities = initializeFacilities;
window.toggleStepDetails = toggleStepDetails;
window.toggleFacilityDetails = toggleFacilityDetails;
