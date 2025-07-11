# NELIE Curriculum Coverage Tracking

This document tracks the status of curriculum data across all NELIE subjects, countries, and grade levels to ensure comprehensive coverage and avoid gaps. It reflects the content currently present in the `src/data/curriculum/` directory.

## Coverage Status Legend
- ❌ **Not Started**: No data exists in `src/data/curriculum/`
- 🟡 **Basic Structure**: Country/Subject/Grade level root node exists.
- 🟠 **In Progress**: Some Domains and/or Learning Objectives (LOs) added.
- 🟢 **Detailed**: Multiple Domains, LOs, and some Knowledge Components (KCs) added.
- ✅ **Comprehensive**: Fully detailed with rich metadata and subject-specific fields (aspirational for mock data).

## United States (US) - English Language

| Subject                 | Grade | Focus Area                                               | Status                                    | Primary Sources             | Notes/Next Steps                                |
|-------------------------|-------|----------------------------------------------------------|-------------------------------------------|-----------------------------|-------------------------------------------------|
| English Language Arts | K     | Reading: Foundational Skills (Print concepts)            | 🟠 In Progress (Course, 1 Domain, 1 LO)   | Common Core State Standards | Add more K ELA domains, LOs, and KCs          |
| English Language Arts | 1     | Reading: Foundational Skills (Phonological awareness)    | 🟠 In Progress (Course, 1 Domain, 1 LO)   | Common Core State Standards | Add more G1 ELA domains, LOs, and KCs         |
| English Language Arts | 2-12  | (Various)                                                | ❌ Not Started                            | Common Core State Standards | Expand ELA coverage to other grades             |

## United States (US) - Mathematics

| Subject     | Grade | Focus Area                                                                 | Status                                     | Primary Sources             | Notes/Next Steps                                |
|-------------|-------|----------------------------------------------------------------------------|--------------------------------------------|-----------------------------|-------------------------------------------------|
| Mathematics | K     | Counting and Cardinality (3 LOs), Operations and Algebraic Thinking (1 LO) | 🟠 In Progress (Course, 2 Domains, 4 LOs)  | Common Core State Standards | Add KCs for existing LOs, add other K Math domains |
| Mathematics | 1     | Operations and Algebraic Thinking (2 LOs)                                    | 🟠 In Progress (Course, 1 Domain, 2 LOs)   | Common Core State Standards | Add KCs for existing LOs, add other G1 Math domains |
| Mathematics | 2-12  | (Various)                                                                  | ❌ Not Started                             | Common Core State Standards | Expand Math coverage to other grades            |

## United States (US) - Science

| Subject | Grade | Focus Area | Status         | Primary Sources | Notes/Next Steps    |
|---------|-------|------------|----------------|-----------------|---------------------|
| Science | K-12  | (Various)  | ❌ Not Started | NGSS            | Add US Science data |

## United States (US) - Mental Wellness

| Subject         | Grade | Focus Area                                                                 | Status                                              | Primary Sources   | Notes/Next Steps                                     |
|-----------------|-------|----------------------------------------------------------------------------|-----------------------------------------------------|-------------------|------------------------------------------------------|
| Mental Wellness | K     | Emotional Awareness, Self-Regulation, Social Connection, Resilience Building | 🟠 In Progress (Course, Domains, 4 LOs per domain)  | User Guidelines | Add KCs, expand LO details                           |
| Mental Wellness | 1     | Emotional Awareness, Self-Regulation, Social Connection, Resilience Building | 🟠 In Progress (Course, Domains, 4 LOs per domain)  | User Guidelines | Add KCs, expand LO details                           |
| Mental Wellness | 2     | Emotional Awareness, Self-Regulation, Social Connection, Resilience Building | 🟠 In Progress (Course, Domains, 4 LOs per domain)  | User Guidelines | Add KCs, expand LO details                           |
| Mental Wellness | 3     | Emotional Intelligence, Stress Management, Healthy Relationships, Growth Mindset | 🟠 In Progress (Course, Domains, 4 LOs per domain)  | User Guidelines | Add KCs, expand LO details                           |
| Mental Wellness | 4     | Emotional Intelligence, Stress Management, Healthy Relationships, Growth Mindset | 🟠 In Progress (Course, Domains, 4 LOs per domain)  | User Guidelines | Add KCs, expand LO details                           |
| Mental Wellness | 5     | Emotional Intelligence, Stress Management, Healthy Relationships, Growth Mindset | 🟠 In Progress (Course, Domains, 4 LOs per domain)  | User Guidelines | Add KCs, expand LO details                           |
| Mental Wellness | 6-12  | (Various)                                                                  | ❌ Not Started                                      | User Guidelines | Expand Mental Wellness to Middle & High School |

## Denmark (DK) - Danish Language

| Subject | Grade     | Focus Area              | Status                               | Primary Sources | Notes/Next Steps                                    |
|---------|-----------|-------------------------|--------------------------------------|-----------------|-----------------------------------------------------|
| Dansk   | Unspecified | Reading Comprehension   | 🟠 In Progress (Subject, 1 LO)       | Fælles Mål      | Specify grade levels, add more Dansk LOs and KCs  |

## Denmark (DK) - Mathematics

| Subject   | Grade     | Focus Area                   | Status                               | Primary Sources | Notes/Next Steps                                      |
|-----------|-----------|------------------------------|--------------------------------------|-----------------|-------------------------------------------------------|
| Matematik | Unspecified | Basic Arithmetic Operations  | 🟠 In Progress (Subject, 1 LO)       | Fælles Mål      | Specify grade levels, add more Matematik LOs and KCs |

## Other NELIE Subjects - Coverage Gaps

*This section reflects subjects for which no data was found in `src/data/curriculum/`.*

| Subject                 | Status         | Notes                                  |
|-------------------------|----------------|----------------------------------------|
| Science (DK)            | ❌ Not Started | No Danish Science data found           |
| Social Studies (US, DK) | ❌ Not Started | No Social Studies data found           |
| Physical Education      | ❌ Not Started | No Physical Education data found       |
| Creative Arts           | ❌ Not Started | No Creative Arts data found            |
| Music                   | ❌ Not Started | No Music data found                    |
| Computer Science        | ❌ Not Started | No Computer Science data found         |
| Life Essentials         | ❌ Not Started | No Life Essentials data found          |
| Other Languages (US)    | ❌ Not Started | No 'Other Languages' data for US found |
| Mental Wellness (DK)    | 🟡 Basic Structure | Root subject node exists, needs LOs    |


## Priority Expansion Areas (General - based on current minimal data)

### High Priority (Foundation Skills for existing data)
1. **US Math K-1**: Add KCs, detail more domains/LOs per Common Core.
2. **US ELA K-1**: Add KCs, detail more domains/LOs per Common Core.
3. **Danish Matematik & Dansk**: Specify grade levels (e.g., Indskoling 0-3), add more LOs/KCs based on Fælles Mål.

### Medium Priority (Broaden initial coverage)
1. **US Science K-2**: Add initial structure (Subject, Course, Domains, sample LOs) based on NGSS.
2. **US Math/ELA Grade 2**: Add initial structure.
3. **Denmark Indskoling (0-3)**: Broaden subject coverage if possible from Fælles Mål.

### Future Expansion
1. **Higher Grades (US & DK)**: Systematically add content for higher grades.
2. **All NELIE Subjects**: Begin populating currently untouched subjects.
3. **Additional Countries**: Expand beyond US and Denmark.

## Quality Standards for "Comprehensive" Status

To achieve ✅ **Comprehensive** status, curriculum data should include:

- **Hierarchical Structure**: Country → Grade → Subject → Domain → Topic → Learning Objective → Knowledge Component
- **Rich Metadata**: Duration estimates, difficulty levels, tags, prerequisites
- **Subject-Specific Fields**: Math domains, linguistic skills, scientific practices
- **Assessment Information**: Assessment types, success criteria
- **Accessibility**: Cultural considerations, differentiation support
- **Standards Alignment**: Source identifiers from official curriculum documents

## Data Sources Reference

- **US Mathematics**: Common Core State Standards (CCSS)
- **US English Language Arts**: Common Core State Standards (CCSS)
- **US Science**: Next Generation Science Standards (NGSS) - *Planned for future data*
- **Danish Subjects**: Fælles Mål (Common Goals)
- **General Structure**: NELIE subject taxonomy and node type hierarchy from `src/types/curriculum/`

---
*Last Updated: (Will be updated by script/commit date)*
*This document reflects the state of mock data in `src/data/curriculum/`.*
