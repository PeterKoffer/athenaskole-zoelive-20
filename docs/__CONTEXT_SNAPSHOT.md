# Context Snapshot – New-core-map

## File tree (src/)
```
 - src/App.css
 - src/App.tsx
 - src/ai/contentService.ts
 - src/ai/promptBuilder.ts
 - src/ai/types.ts
 - src/build-notes.ts
 - src/build-suppressions.ts
 - src/components/AITutor.tsx
 - src/components/AuthHandler.tsx
 - src/components/AuthModal.tsx
 - src/components/EnhancedAITutor.tsx
 - src/components/EnhancedNELIELessonManager.tsx
 - src/components/ErrorBoundary.tsx
 - src/components/GameHub.tsx
 - src/components/JulesIntegration.tsx
 - src/components/LanguageSwitcher.tsx
 - src/components/LessonStream.tsx
 - src/components/NELIE.tsx
 - src/components/NELIE/NELIE
 - src/components/NELIE/NELIE.tsx
 - src/components/NELIE/RefactoredFloatingAITutor.tsx
 - src/components/NELIE/floating/RefactoredFloatingAITutor.tsx
 - src/components/NELIE/index.ts
 - src/components/NELIE/legacy/NELIE.main.tsx
 - src/components/NELIELauncher.tsx
 - src/components/OpenAIApiTest.tsx
 - src/components/ProfileDebugButton.tsx
 - src/components/ProfileServiceTest.tsx
 - src/components/ProgressDashboard.tsx
 - src/components/ProtectedRoute.tsx
 - src/components/RefactoredFloatingAITutor.tsx
 - src/components/RoleSwitcher.tsx
 - src/components/SingleNELIE.tsx
 - src/components/SiteMap.tsx
 - src/components/SubscriptionPlans.tsx
 - src/components/ThemeProvider.tsx
 - src/components/UniversePlayer.tsx
 - src/components/UserVerificationDebug.tsx
 - src/components/activities/EducationalGameEngine.tsx
 - src/components/analytics/UserAnalyticsDashboard.tsx
 - src/components/auth/AuthForm.tsx
 - src/components/auth/AuthFormFields.tsx
 - src/components/auth/AuthTestHelper.tsx
 - src/components/auth/QuickTestAuth.tsx
 - src/components/auth/RoleSelector.tsx
 - src/components/auth/role-selector/ClearanceForm.tsx
 - src/components/auth/role-selector/RoleCard.tsx
 - src/components/auth/role-selector/RoleGrid.tsx
 - src/components/auth/role-selector/roleConstants.ts
 - src/components/calendar/EventModal.tsx
 - src/components/calendar/JointCalendar.tsx
 - src/components/calendar/KeywordEventModal.tsx
 - src/components/calendar/MultiLayerCalendar.tsx
 - src/components/communication/ChatWindow.tsx
 - src/components/communication/ClassSelector.tsx
 - src/components/communication/ClassUsersList.tsx
 - src/components/communication/CommunicationCenter.tsx
 - src/components/communication/ConversationsList.tsx
 - src/components/communication/DirectMessaging.tsx
 - src/components/communication/DynamicGroupGenerator.tsx
 - src/components/communication/GlobalCommunicationButton.tsx
 - src/components/communication/GroupCard.tsx
 - src/components/communication/ImprovedUserSelector.tsx
 - src/components/communication/MessageGroupsList.tsx
 - src/components/communication/PredefinedGroupsList.tsx
 - src/components/communication/UserSelector.tsx
 - src/components/daily-program/AIEnhancedActivityCard.tsx
 - src/components/daily-program/ActivityCard.tsx
 - src/components/daily-program/EnhancedDailyProgram.tsx
 - src/components/daily-program/NeliesTips.tsx
 - src/components/daily-program/TodaysProgramGrid.tsx
 - src/components/daily-program/WelcomeCard.tsx
 - src/components/daily-program/dailyActivitiesData.ts
 - src/components/demo/GameAssignmentDemo.tsx
 - src/components/education/EnhancedBodyLabLearning.tsx
 - src/components/education/EnhancedGlobalGeographyLearning.tsx
 - src/components/education/EnhancedLifeEssentialsLearning.tsx
 - src/components/education/EnhancedMathematicsLearning.tsx
 - src/components/education/EnhancedMentalWellnessLearning.tsx
 - src/components/education/EnhancedWorldHistoryReligionsLearning.tsx
 - src/components/education/StableLearningInterface.tsx
 - src/components/education/SystemMonitor.tsx
 - src/components/education/UniversalLearning.tsx
 - src/components/education/components/ActivityAnswerHandler.tsx
 - src/components/education/components/ActivityExplanation.tsx
 - src/components/education/components/ActivityGame.tsx
 - src/components/education/components/ActivityQuestion.tsx
 - src/components/education/components/ActivityRenderer.tsx
 - src/components/education/components/AnswerOptions.tsx
 - src/components/education/components/EnhancedActivityRenderer.tsx
 - src/components/education/components/EnhancedLessonContent.ts
 - src/components/education/components/EnhancedLessonManager.tsx
 - src/components/education/components/EnhancedMathLearningWithTemplate.tsx
 - src/components/education/components/EnhancedNELIELessonManager.tsx
 - src/components/education/components/IntroductionContent.tsx
 - src/components/education/components/IntroductionSteps.tsx
 - src/components/education/components/LessonActivityManager.tsx
 - src/components/education/components/LessonActivityRenderer.tsx
 - src/components/education/components/LessonActivitySpeechManager.tsx
 - src/components/education/components/LessonCompletedView.tsx
 - src/components/education/components/LessonControls.tsx
 - src/components/education/components/LessonControlsCard.tsx
 - src/components/education/components/LessonControlsFooter.tsx
 - src/components/education/components/LessonPausedView.tsx
 - src/components/education/components/LessonPhaseRenderer.tsx
 - src/components/education/components/LessonProgressHeader.tsx
 - src/components/education/components/LessonProgressSection.tsx
 - src/components/education/components/LessonProgressTracker.tsx
 - src/components/education/components/LessonStateManager.tsx
 - src/components/education/components/NelieAvatarSection.tsx
 - src/components/education/components/NelieIntroduction.tsx
 - src/components/education/components/ProgressIndicator.tsx
 - src/components/education/components/QuestionDisplay.tsx
 - src/components/education/components/QuestionResult.tsx
 - src/components/education/components/StandardLessonProgressIndicator.tsx
 - src/components/education/components/TrainingGroundActivityRenderer.tsx
 - src/components/education/components/UnifiedClassIntroductionProgress.tsx
 - src/components/education/components/UnifiedLessonControls.tsx
 - src/components/education/components/interfaces/LessonControlsTypes.ts
 - src/components/education/components/lessonManager/LessonControls.tsx
 - src/components/education/components/lessonManager/LessonLoadingState.tsx
 - src/components/education/components/lessonManager/LessonPreparationState.tsx
 - src/components/education/components/lessonManager/LessonProgressDisplay.tsx
 - src/components/education/components/math/AIGeneratedMathQuestion.tsx
 - src/components/education/components/math/CleanMathLearning.tsx
 - src/components/education/components/math/FullyFunctionalMathLearning.tsx
 - src/components/education/components/math/FunctionalMathScoreboard.tsx
 - src/components/education/components/math/MathActivitiesData.ts
 - src/components/education/components/math/MathBattleArenaActivity.ts
 - src/components/education/components/math/MathLearningContent.tsx
 - src/components/education/components/math/MathLearningIntroduction.tsx
 - src/components/education/components/math/MathLearningLoading.tsx
 - src/components/education/components/math/MathLearningMainContent.tsx
 - src/components/education/components/math/MathLessonContentRenderer.tsx
 - src/components/education/components/math/MathLessonControlPanel.tsx
 - src/components/education/components/math/MathLessonHeader.tsx
 - src/components/education/components/math/MathWelcomeMessage.tsx
 - src/components/education/components/math/MentalMathStrategies.tsx
 - src/components/education/components/math/OptimizedMathLearningContent.tsx
 - src/components/education/components/math/SimpleMathLearningContent.tsx
 - src/components/education/components/math/hooks/useSpeechCleanup.ts
 - src/components/education/components/math/hooks/useStudentName.ts
 - src/components/education/components/math/utils/mathActivityGenerator.ts
 - src/components/education/components/question/QuestionActivityContent.tsx
 - src/components/education/components/question/QuestionActivityControls.tsx
 - src/components/education/components/question/QuestionActivityHeader.tsx
 - src/components/education/components/question/QuestionActivityResult.tsx
 - src/components/education/components/question/QuestionAnswerOptions.tsx
 - src/components/education/components/question/QuestionControls.tsx
 - src/components/education/components/question/QuestionErrorState.tsx
 - src/components/education/components/question/QuestionHeader.tsx
 - src/components/education/components/question/QuestionLoadingState.tsx
 - src/components/education/components/question/QuestionResult.tsx
 - src/components/education/components/shared/AskNelieButtons.tsx
 - src/components/education/components/shared/Blackboard.tsx
 - src/components/education/components/shared/ClassroomEnvironment.tsx
 - src/components/education/components/shared/GlobalImagePreloader.tsx
 - src/components/education/components/shared/TextWithSpeaker.tsx
 - src/components/education/components/shared/UnifiedLessonNavigation.tsx
 - src/components/education/components/shared/classroomConfigs.ts
 - src/components/education/components/shared/hooks/useClassroomEnvironment.ts
 - src/components/education/components/shared/hooks/useImageLoaded.ts
 - src/components/education/components/shared/hooks/useImagePreloader.ts
 - src/components/education/components/shared/hooks/useOptimizedImageLoaded.ts
 - src/components/education/components/types/AdaptiveLessonTypes.ts
 - src/components/education/components/types/LessonTypes.ts
 - src/components/education/components/universal/UniversalLearningIntroduction.tsx
 - src/components/education/components/universal/UniversalLearningLoading.tsx
 - src/components/education/components/universal/UniversalLearningMainContent.tsx
 - src/components/education/components/utils/EngagingLessonGenerator.ts
 - src/components/education/components/utils/EnhancedBodyLabLessonFactory.ts
 - src/components/education/components/utils/EnhancedContentUniquenessSystem.ts
 - src/components/education/components/utils/EnhancedGlobalGeographyLessonFactory.ts
 - src/components/education/components/utils/EnhancedLessonGenerator.ts
 - src/components/education/components/utils/EnhancedLifeEssentialsLessonFactory.ts
 - src/components/education/components/utils/EnhancedMentalWellnessLessonFactory.ts
 - src/components/education/components/utils/EnhancedSubjectLessonFactory.ts
 - src/components/education/components/utils/EnhancedWorldHistoryReligionsLessonFactory.ts
 - src/components/education/components/utils/LessonValidator.ts
 - src/components/education/components/utils/StandardLessonTemplate.ts
 - src/components/education/components/utils/enhancedSubjectIntroductions.ts
 - src/components/education/components/utils/subjectIntroductions.ts
 - src/components/education/components/utils/subjectSpecificTemplates.ts
 - src/components/education/components/utils/universalContentGenerator.ts
 - src/components/education/components/utils/welcomeActivityGenerator.ts
 - src/components/education/components/welcome/BodyLabWelcome.tsx
 - src/components/education/components/welcome/ComputerScienceWelcome.tsx
 - src/components/education/components/welcome/CreativeArtsWelcome.tsx
 - src/components/education/components/welcome/EnglishWelcome.tsx
 - src/components/education/components/welcome/GeographyWelcome.tsx
 - src/components/education/components/welcome/HistoryReligionWelcome.tsx
 - src/components/education/components/welcome/LanguageLabWelcome.tsx
 - src/components/education/components/welcome/LifeEssentialsWelcome.tsx
 - src/components/education/components/welcome/MathematicsWelcome.tsx
 - src/components/education/components/welcome/MentalWellnessWelcome.tsx
 - src/components/education/components/welcome/MusicWelcome.tsx
 - src/components/education/components/welcome/ScienceWelcome.tsx
 - src/components/education/computer-science/CSAdaptiveView.tsx
 - src/components/education/computer-science/CSFeaturedGames.tsx
 - src/components/education/computer-science/CSLearningHeader.tsx
 - src/components/education/computer-science/CSLearningJourney.tsx
 - src/components/education/computer-science/CSMainView.tsx
 - src/components/education/computer-science/CSModeManager.tsx
 - src/components/education/computer-science/CSSkillAreasGrid.tsx
 - src/components/education/contexts/UnifiedLessonContext.tsx
 - src/components/education/contexts/UnifiedLessonProvider.tsx
 - src/components/education/contexts/hooks/useDailyLessonGeneration.ts
 - src/components/education/contexts/hooks/useLessonActions.ts
 - src/components/education/contexts/hooks/useLessonInitialization.ts
 - src/components/education/contexts/hooks/useUnifiedLessonActions.ts
 - src/components/education/contexts/hooks/useUnifiedLessonState.ts
 - src/components/education/contexts/types/LessonContextTypes.ts
 - src/components/education/contexts/types/UnifiedLessonTypes.ts
 - src/components/education/english/EnglishHeader.tsx
 - src/components/education/english/EnglishQuestion.tsx
 - src/components/education/hooks/useActivityProgression.ts
 - src/components/education/hooks/useClassIntroduction.ts
 - src/components/education/hooks/useLessonStateManager.ts
 - src/components/education/hooks/useLessonTimer.ts
 - src/components/education/hooks/useTimerManager.ts
 - src/components/education/index.tsx
 - src/components/education/math/MathHeader.tsx
 - src/components/education/math/MathLessonIntroCard.tsx
 - src/components/education/math/MathQuestion.tsx
 - src/components/education/music/EnhancedMusicLesson.tsx
 - src/components/education/music/MusicUniverseWelcome.tsx
 - src/components/education/templates/CanonicalLessonTemplate.ts
 - src/components/education/templates/EngagingActivityFactory.ts
 - src/components/education/templates/EnglishInteractiveTemplate.tsx
 - src/components/education/templates/InteractiveLessonTemplate.tsx
 - src/components/education/templates/LessonTemplateFactory.tsx
 - src/components/education/templates/MathInteractiveTemplate.tsx
 - src/components/education/templates/MultiSubjectLessonTemplate.tsx
 - src/components/education/templates/ScienceInteractiveTemplate.tsx
 - src/components/education/templates/StandardLessonTemplate.ts
 - src/components/education/templates/SubjectTemplateFactory.tsx
 - src/components/education/templates/UniversalLessonTemplate.tsx
 - src/components/education/types.ts
 - src/components/games/CurriculumGameConfig.ts
 - src/components/games/CurriculumGameSelector.tsx
 - src/components/games/GameCard.tsx
 - src/components/games/GameEngine.tsx
 - src/components/games/LeaderboardCard.tsx
 - src/components/games/SampleGame.tsx
 - src/components/games/StudentGameAssignments.tsx
 - src/components/games/VikingCastleGame.tsx
 - src/components/games/components/GameCard.tsx
 - src/components/games/components/GameFilters.tsx
 - src/components/games/components/GameHeader.tsx
 - src/components/games/components/GameSelectorHeader.tsx
 - src/components/games/data/ComputerScienceGames.ts
 - src/components/games/data/EnglishGames.ts
 - src/components/games/data/GameData.ts
 - src/components/games/data/LanguageGames.ts
 - src/components/games/data/MathematicsGames.ts
 - src/components/games/data/MusicGames.ts
 - src/components/games/data/ScienceGames.ts
 - src/components/games/data/SocialStudiesGames.ts
 - src/components/games/data/index.ts
 - src/components/games/engine/GameEngine.tsx
 - src/components/games/engine/interactions/ClickSequenceGame.tsx
 - src/components/games/engine/interactions/DragDropGame.tsx
 - src/components/games/engine/interactions/DrawingGame.tsx
 - src/components/games/engine/interactions/MultipleChoiceGame.tsx
 - src/components/games/engine/interactions/SimulationGame.tsx
 - src/components/games/engine/interactions/TypingGame.tsx
 - src/components/games/hooks/useGameStateManager.ts
 - src/components/games/interactions/DragDropGame.tsx
 - src/components/games/interactions/FractionPizzaGame.tsx
 - src/components/games/interactions/NumberLineGame.tsx
 - src/components/games/types/GameTypes.ts
 - src/components/games/utils/GameDataLoader.ts
 - src/components/games/utils/GameFilters.ts
 - src/components/games/utils/GameSelectorUtils.ts
 - src/components/gamification/DailyChallenges.tsx
 - src/components/gamification/RewardsSystem.tsx
 - src/components/home/CTASection.tsx
 - src/components/home/DateWidget.tsx
 - src/components/home/FeaturesSection.tsx
 - src/components/home/HeroSection.tsx
 - src/components/home/HomeMainContent.tsx
 - src/components/home/HomepageWelcome.tsx
 - src/components/home/SpeechControls.tsx
 - src/components/home/SubjectsData.ts
 - src/components/home/SubjectsSection.tsx
 - src/components/home/WelcomeContent.tsx
 - src/components/home/subject-card/SubjectCard.tsx
 - src/components/home/subject-card/SubjectCardButton.tsx
 - src/components/home/subject-card/SubjectCardIcon.tsx
 - src/components/home/subject-card/SubjectCardTooltip.tsx
 - src/components/home/subject-card/subjectCardConstants.ts
 - src/components/home/subject-card/types.ts
 - src/components/language-learning/LanguageSelectionView.tsx
 - src/components/language-learning/LessonControls.tsx
 - src/components/language-learning/LessonHeader.tsx
 - src/components/language-learning/LessonView.tsx
 - src/components/language-learning/ProgressHeader.tsx
 - src/components/language-learning/QuestionCard.tsx
 - src/components/language-learning/ResultCard.tsx
 - src/components/language-learning/SectionRenderer.tsx
 - src/components/language-learning/hooks/useAnswerHandler.ts
 - src/components/language-learning/hooks/useAudioPlayer.ts
 - src/components/language-learning/hooks/useLessonNavigation.ts
 - src/components/language-learning/hooks/useLessonState.ts
 - src/components/language-learning/types.ts
 - src/components/layout/AppLoadingWrapper.tsx
 - src/components/layout/DashboardHomeButton.tsx
 - src/components/layout/Footer.tsx
 - src/components/layout/MobileMenu.tsx
 - src/components/layout/Navbar.tsx
 - src/components/layout/NavbarButton.tsx
 - src/components/layout/NavbarDesktopMenu.tsx
 - src/components/layout/NavbarLogo.tsx
 - src/components/layout/NavbarUserMenu.tsx
 - src/components/layout/UnifiedNavigationDropdown.tsx
 - src/components/layout/UserMenu.tsx
 - src/components/layout/UserRoleDisplay.tsx
 - src/components/parent/ChildSelector.tsx
 - src/components/parent/ParentDropdownMenus.tsx
 - src/components/parent/ParentNavbar.tsx
 - src/components/parent/ParentNotifications.tsx
 - src/components/parent/ParentTabsContent.tsx
 - src/components/parent/WeeklyProgressSection.tsx
 - src/components/profile/AvatarColorPicker.tsx
 - src/components/profile/AvatarUpload.tsx
 - src/components/profile/ProfileCard.tsx
 - src/components/profile/ProfileContainer.tsx
 - src/components/profile/ProfileForm.tsx
 - src/components/profile/ProfileHeader.tsx
 - src/components/profile/ProfileTabs.tsx
 - src/components/profile/form/AcademicInfoSection.tsx
 - src/components/profile/form/ContactInfoSection.tsx
 - src/components/profile/form/PersonalInfoSection.tsx
 - src/components/profile/form/ProfileFormActions.tsx
 - src/components/profile/hooks/types.ts
 - src/components/profile/hooks/useAvatarUpload.ts
 - src/components/profile/hooks/useProfileData.ts
 - src/components/profile/hooks/useProfileFetch.ts
 - src/components/profile/hooks/useProfileUpdate.ts
 - src/components/profile/hooks/useSimpleProfile.ts
 - src/components/progress/AILearningCTA.tsx
 - src/components/progress/AchievementsCard.tsx
 - src/components/progress/ParentEmailCard.tsx
 - src/components/progress/SubjectProgressCards.tsx
 - src/components/progress/WeeklyActivityChart.tsx
 - src/components/progress/WeeklyGoalsCard.tsx
 - src/components/scenario-engine/ScenarioPlayer.tsx
 - src/components/scenario-engine/components/ScenarioCard.tsx
 - src/components/scenario-engine/components/ScenarioContent.tsx
 - src/components/scenario-engine/components/ScenarioHeader.tsx
 - src/components/scenario-engine/components/ScenarioSidebar.tsx
 - src/components/scenario-engine/components/SimulationsHeader.tsx
 - src/components/scenario-engine/data/testScenario.ts
 - src/components/scenario-engine/hooks/useScenarioAnswering.ts
 - src/components/scenario-engine/hooks/useScenarioCompletion.ts
 - src/components/scenario-engine/hooks/useScenarioEventLogging.ts
 - src/components/scenario-engine/hooks/useScenarioNavigation.ts
 - src/components/scenario-engine/hooks/useScenarioSession.ts
 - src/components/school/AnalyticsDashboard.tsx
 - src/components/school/ClassManagement.tsx
 - src/components/school/ImprovedClassDistributionChart.tsx
 - src/components/school/SchoolDashboardAccessControl.tsx
 - src/components/school/SchoolDashboardContent.tsx
 - src/components/school/SchoolManagementDropdown.tsx
 - src/components/school/SchoolNavbar.tsx
 - src/components/school/SchoolOverviewTab.tsx
 - src/components/school/SchoolStatsCards.tsx
 - src/components/school/SchoolWelcomeBanner.tsx
 - src/components/school/StudentRegistration.tsx
 - src/components/school/TeachingPerspectiveSettings.tsx
 - src/components/school/TeachingSettingsModal.tsx
 - src/components/school/analytics/EngagementTab.tsx
 - src/components/school/analytics/KeyMetricsSection.tsx
 - src/components/school/analytics/PerformanceTab.tsx
 - src/components/school/analytics/SubjectsTab.tsx
 - src/components/school/analytics/TrendsTab.tsx
 - src/components/school/class-management/ClassAssignmentsTab.tsx
 - src/components/school/class-management/ClassOverviewTab.tsx
 - src/components/school/class-management/ClassScheduleTab.tsx
 - src/components/school/class-management/ClassSelector.tsx
 - src/components/school/class-management/ClassStudentsTab.tsx
 - src/components/school/class-management/EditStudentModal.tsx
 - src/components/school/hooks/useStudentRegistration.tsx
 - src/components/school/hooks/useTeachingPerspectiveSettings.ts
 - src/components/school/registration/AcademicInfoStep.tsx
 - src/components/school/registration/ConfirmationStep.tsx
 - src/components/school/registration/ContactInfoStep.tsx
 - src/components/school/registration/ParentInfoStep.tsx
 - src/components/school/registration/PersonalInfoStep.tsx
 - src/components/school/registration/RegistrationNavigationButtons.tsx
 - src/components/school/registration/RegistrationProgressSteps.tsx
 - src/components/school/registration/StudentRegistrationForm.tsx
 - src/components/simulator/ContentRenderer.tsx
 - src/components/simulator/DifficultySelector.tsx
 - src/components/simulator/Game.tsx
 - src/components/simulator/LessonPlayer.tsx
 - src/components/simulator/SimulatorInterface.tsx
 - src/components/speech/BrowserSpeechEngine.ts
 - src/components/speech/ElevenLabsAudioPlayer.ts
 - src/components/speech/ElevenLabsConfig.ts
 - src/components/speech/ElevenLabsService.ts
 - src/components/speech/ElevenLabsSpeechEngine.ts
 - src/components/speech/ElevenLabsSpeechGenerator.ts
 - src/components/speech/ElevenLabsTypes.ts
 - src/components/speech/ElevenLabsVoiceManager.ts
 - src/components/speech/EventListeners.ts
 - src/components/speech/SpeechConfig.ts
 - src/components/speech/SpeechDeduplicationManager.ts
 - src/components/speech/SpeechEngines.ts
 - src/components/speech/SpeechInitializer.ts
 - src/components/speech/SpeechOrchestrator.ts
 - src/components/speech/SpeechQueueProcessor.ts
 - src/components/speech/SpeechState.ts
 - src/components/speech/SpeechStateManager.ts
 - src/components/speech/SpeechSystemQueue.ts
 - src/components/speech/ToastUtils.ts
 - src/components/speech/UnifiedSpeechSystem.ts
 - src/components/speech/engine/BrowserEngine.ts
 - src/components/speech/engine/BrowserSpeak.ts
 - src/components/speech/engine/ElevenLabsEngine.ts
 - src/components/speech/engine/ElevenLabsSpeak.ts
 - src/components/student/PracticeSkillsModal.tsx
 - src/components/subjects/body-lab/BodyLabLearning.tsx
 - src/components/subjects/computer-science/ComputerScienceLearning.tsx
 - src/components/subjects/creative-arts/CreativeArtsLearning.tsx
 - src/components/subjects/english/EnglishLearning.tsx
 - src/components/subjects/geography/GeographyLearning.tsx
 - src/components/subjects/global-geography/GlobalGeographyLearning.tsx
 - src/components/subjects/history-religion/HistoryReligionLearning.tsx
 - src/components/subjects/language-lab/LanguageLabLearning.tsx
 - src/components/subjects/life-essentials/LifeEssentialsLearning.tsx
 - src/components/subjects/mathematics/MathematicsLearning.tsx
 - src/components/subjects/mathematics/SimpleMathematicsLearning.tsx
 - src/components/subjects/mental-wellness/MentalWellnessLearning.tsx
 - src/components/subjects/music/MusicLearning.tsx
 - src/components/subjects/science/ScienceLearning.tsx
 - src/components/subjects/world-history-religions/WorldHistoryReligionsLearning.tsx
 - src/components/teacher/ClassLessonDurationSettings.tsx
 - src/components/teacher/ClassroomManagement.tsx
 - src/components/teacher/GameAnalyticsDashboard.tsx
 - src/components/teacher/SubjectWeighting.tsx
 - src/components/teacher/TeacherGameAssignments.tsx
 - src/components/teacher/TeacherNavbar.tsx
 - src/components/teacher/TeacherOverviewTab.tsx
 - src/components/teacher/TeacherStatsCards.tsx
 - src/components/teacher/TeacherSubjectWeighting.tsx
 - src/components/teacher/hooks/useClassLessonDurations.ts
 - src/components/testing/AdaptiveIntegrationTestInterface.tsx
 - src/components/testing/ButtonTestingComponent.tsx
 - src/components/testing/K5LessonTester.tsx
 - src/components/testing/LocalizationTestPanel.tsx
 - src/components/testing/index.ts
 - src/components/theme-provider.tsx
 - src/components/training-ground/TrainingGroundMain.tsx
 - src/components/training-ground/TrainingGroundPreview.tsx
 - src/components/training-ground/activities/ActivityRenderer.tsx
 - src/components/ui/LoadingSpinner.tsx
 - src/components/ui/accordion.tsx
 - src/components/ui/alert-dialog.tsx
 - src/components/ui/alert.tsx
 - src/components/ui/aspect-ratio.tsx
 - src/components/ui/avatar.tsx
 - src/components/ui/badge.tsx
 - src/components/ui/breadcrumb.tsx
 - src/components/ui/button.tsx
 - src/components/ui/calendar.tsx
 - src/components/ui/card.tsx
 - src/components/ui/carousel.tsx
 - src/components/ui/chart.tsx
 - src/components/ui/checkbox.tsx
 - src/components/ui/collapsible.tsx
 - src/components/ui/command.tsx
 - src/components/ui/context-menu.tsx
 - src/components/ui/custom-speaker-icon.tsx
 - src/components/ui/dialog.tsx
 - src/components/ui/drawer.tsx
 - src/components/ui/dropdown-menu.tsx
 - src/components/ui/form.tsx
 - src/components/ui/hover-card.tsx
 - src/components/ui/input-otp.tsx
 - src/components/ui/input.tsx
 - src/components/ui/label.tsx
 - src/components/ui/menubar.tsx
 - src/components/ui/navigation-menu.tsx
 - src/components/ui/pagination.tsx
 - src/components/ui/popover.tsx
 - src/components/ui/progress.tsx
 - src/components/ui/radio-group.tsx
 - src/components/ui/resizable.tsx
 - src/components/ui/scroll-area.tsx
 - src/components/ui/select.tsx
 - src/components/ui/separator.tsx
 - src/components/ui/sheet.tsx
 - src/components/ui/sidebar.tsx
 - src/components/ui/skeleton.tsx
 - src/components/ui/slider.tsx
 - src/components/ui/sonner.tsx
 - src/components/ui/speakable-card.tsx
 - src/components/ui/switch.tsx
 - src/components/ui/table.tsx
 - src/components/ui/tabs.tsx
 - src/components/ui/textarea.tsx
 - src/components/ui/toast.tsx
 - src/components/ui/toaster.tsx
 - src/components/ui/toggle-group.tsx
 - src/components/ui/toggle.tsx
 - src/components/ui/tooltip.tsx
 - src/components/ui/use-toast.ts
 - src/config/aiConfig.ts
 - src/config/appContext.ts
 - src/constants/lesson.ts
 - src/constants/school.ts
 - src/content/index.ts
 - src/contexts/RoleContext.tsx
 - src/data/CurriculumStepGradeMap.ts
 - src/data/ai-curriculum.json
 - src/data/curriculum.json
 - src/data/curriculum/dk/dkComputerScienceData.ts
 - src/data/curriculum/dk/dkCreativeArtsData.ts
 - src/data/curriculum/dk/dkData.ts
 - src/data/curriculum/dk/dkLifeEssentialsData.ts
 - src/data/curriculum/dk/dkMusicData.ts
 - src/data/curriculum/index.ts
 - src/data/curriculum/us/music-discovery.ts
 - src/data/curriculum/us/usComputerScienceData.ts
 - src/data/curriculum/us/usCreativeArtsData.ts
 - src/data/curriculum/us/usElaData.ts
 - src/data/curriculum/us/usGeographyData.ts
 - src/data/curriculum/us/usHistoryData.ts
 - src/data/curriculum/us/usLifeEssentialsData.ts
 - src/data/curriculum/us/usMathData.ts
 - src/data/curriculum/us/usMentalWellnessData.ts
 - src/data/curriculum/us/usMusicData.ts
 - src/data/curriculum/us/usPEData.ts
 - src/data/curriculum/us/usRootData.ts
 - src/data/curriculum/us/usScienceData.ts
 - src/data/curriculum/us/usSpanishData.ts
 - src/data/curriculumStandards.ts
 - src/data/demoScenarios.ts
 - src/data/mockCurriculumData.ts
 - src/data/mockKnowledgeComponents.json
 - src/data/mockLessonCoverage.ts
 - src/data/schoolAnalytics.ts
 - src/data/static/curriculum-steps.json
 - src/data/static/games/computerscience-games.json
 - src/data/static/games/english-games.json
 - src/data/static/games/language-games.json
 - src/data/static/games/mathematics-games.json
 - src/data/static/games/music-games.json
 - src/data/static/games/science-games.json
 - src/data/static/games/socialstudies-games.json
 - src/data/unified-curriculum-index.json
 - src/data/unified-curriculum-index.json.bak
 - src/data/unified-curriculum-index.ts
 - src/domain/curriculum/index.ts
 - src/domain/roles.ts
 - src/domain/spec/adaption.ts
 - src/domain/spec/resolveParams.ts
 - src/domain/subjects.ts
 - src/features/auth/pages/Auth.tsx
 - src/features/auth/pages/Preferences.tsx
 - src/features/auth/pages/Profile.tsx
 - src/features/daily-program/pages/DailyProgramPage.tsx
 - src/features/daily-program/pages/EducationalSimulatorRedirect.tsx
 - src/features/daily-program/pages/ScenarioRunner.tsx
 - src/features/daily-program/pages/TodaysProgram.tsx
 - src/features/daily-program/pages/UniverseLesson.tsx
 - src/features/dashboards/pages/Dashboard.tsx
 - src/features/nelie/avatar.ts
 - src/features/shell/pages/Landing.tsx
 - src/features/simulator/dsl/schema.ts
 - src/features/simulator/engine/engine.ts
 - src/global-suppressions.d.ts
 - src/hooks/use-mobile.tsx
 - src/hooks/use-toast.ts
 - src/hooks/useAIContentRecommendations.ts
 - src/hooks/useAIInteractionLogger.ts
 - src/hooks/useAIStream.ts
 - src/hooks/useActivityTracking.ts
 - src/hooks/useAdaptiveLearning.ts
 - src/hooks/useAdaptiveLearningSession.ts
 - src/hooks/useAdvancedQuestionQueue.ts
 - src/hooks/useAuth.tsx
 - src/hooks/useAuthForm.ts
 - src/hooks/useAuthModal.ts
 - src/hooks/useAuthRedirect.ts
 - src/hooks/useCodeSuggestions.ts
 - src/hooks/useCommunication.ts
 - src/hooks/useConsolidatedSpeech.ts
 - src/hooks/useDashboardState.ts
 - src/hooks/useGameTracking.ts
 - src/hooks/useGradeLevelContent.ts
 - src/hooks/useHomeNavbarLogic.ts
 - src/hooks/useLearningProfile.ts
 - src/hooks/useLearningSession.ts
 - src/hooks/useNavbarState.ts
 - src/hooks/useNavigation.ts
 - src/hooks/usePageTracking.ts
 - src/hooks/usePerformanceMetrics.ts
 - src/hooks/useRoleAccess.ts
 - src/hooks/useRoleUpgrade.ts
 - src/hooks/useSessionActions.ts
 - src/hooks/useSessionLifecycle.ts
 - src/hooks/useSessionMetrics.ts
 - src/hooks/useSimpleMobileSpeech.ts
 - src/hooks/useSimpleRoleAccess.ts
 - src/hooks/useSimplifiedSpeech.ts
 - src/hooks/useSoundEffects.ts
 - src/hooks/useUnifiedQuestionGeneration.ts
 - src/hooks/useUnifiedSpeech.ts
 - src/i18n.ts
 - src/index.css
 - src/integrations/supabase/client.ts
 - src/integrations/supabase/types.ts
 - src/lib/ai.ts
 - src/lib/build-suppress.ts
 - src/lib/supabaseClient.ts
 - src/lib/utils.ts
 - src/locales/da/translation.json
 - src/locales/en/translation.json
 - src/locales/es/translation.json
 - src/main.tsx
 - src/main.tsx.bak.1756895609
 - src/nav-items.tsx
 - src/pages/AIInsightsPage.tsx
 - src/pages/AILearning.tsx
 - src/pages/AboutPage.tsx
 - src/pages/AcademicReportsPage.tsx
 - src/pages/AdaptiveIntegrationTest.tsx
 - src/pages/AdaptiveLearning.tsx
 - src/pages/AdaptiveLearningDemo.tsx
 - src/pages/AdaptiveLearningPage.tsx
 - src/pages/AdaptivePracticeTestPage.tsx
 - src/pages/Admin.tsx
 - src/pages/AdminDashboard.tsx
 - src/pages/AdminPage.tsx
 - src/pages/Analytics.tsx
 - src/pages/AnnouncementsPage.tsx
 - src/pages/ApiTestPage.tsx
 - src/pages/AttendanceAnalyticsPage.tsx
 - src/pages/Auth.tsx
 - src/pages/AuthPage.tsx
 - src/pages/CalendarPage.tsx
 - src/pages/CommunicationCenter.tsx
 - src/pages/CommunicationPage.tsx
 - src/pages/ConsolidatedSimulatorPage.tsx
 - src/pages/CurriculumEditorPage.tsx
 - src/pages/CurriculumSystem.tsx
 - src/pages/DailyLearningSessionPage.tsx
 - src/pages/DailyProgram.tsx
 - src/pages/DevAiLab.tsx
 - src/pages/EducationPage.tsx
 - src/pages/GameHub.tsx
 - src/pages/GameHubPage.tsx
 - src/pages/HomePage.tsx
 - src/pages/Index.tsx
 - src/pages/LandingPage.tsx
 - src/pages/LearningPathway.tsx
 - src/pages/LocalizationTestPage.tsx
 - src/pages/MathPage.tsx
 - src/pages/MathematicsLearningPage.tsx
 - src/pages/MusicLesson.tsx
 - src/pages/NelieChat.tsx
 - src/pages/NotFound.tsx
 - src/pages/ParentDashboard.tsx
 - src/pages/ParentPage.tsx
 - src/pages/ProfilePage.tsx
 - src/pages/ProgressDashboard.tsx
 - src/pages/ProgressPage.tsx
 - src/pages/ProgressTrackingPage.tsx
 - src/pages/ScenarioPlayerPage.tsx
 - src/pages/ScheduleManagementPage.tsx
 - src/pages/SchoolAdminPage.tsx
 - src/pages/SchoolAnalyticsPage.tsx
 - src/pages/SchoolDashboard.tsx
 - src/pages/SimpleMathematicsLearningPage.tsx
 - src/pages/SimpleSchoolDashboard.tsx
 - src/pages/SimpleStealthTest.tsx
 - src/pages/SimulationsPage.tsx
 - src/pages/SiteMapPage.tsx
 - src/pages/StaffManagementPage.tsx
 - src/pages/StealthAssessmentTest.tsx
 - src/pages/StealthAssessmentTestPage.tsx
 - src/pages/StudentDashboard.tsx
 - src/pages/StudentManagementPage.tsx
 - src/pages/StudentPage.tsx
 - src/pages/StudentRecordsPage.tsx
 - src/pages/SubjectLearningPage.tsx
 - src/pages/SubscriptionPage.tsx
 - src/pages/TeacherCommunicationsPage.tsx
 - src/pages/TeacherDashboard.tsx
 - src/pages/TeacherPage.tsx
 - src/pages/TestPage.tsx
 - src/pages/TestingPage.tsx
 - src/pages/TrainingGround.tsx
 - src/pages/UniversePage.tsx
 - src/routes/AppRouter.tsx
 - src/scripts/exportInteractionEvents.ts
 - src/scripts/populateKnowledgeComponents.ts
 - src/services/AIUniverseGenerator.ts
 - src/services/AdaptiveDifficultyEngine.ts
 - src/services/CalendarService.ts
 - src/services/ContentGenerationService.ts
 - src/services/CurriculumMapper.ts
 - src/services/DynamicNarrativeService.ts
 - src/services/EnhancedLessonGenerator.ts
 - src/services/EnhancedSubjectLessonFactory.ts
 - src/services/InSessionAdaptiveManager.ts
 - src/services/NELIESessionGenerator.ts
 - src/services/NlpService.ts
 - src/services/OpenAIService.ts
 - src/services/PersonalizationEngine.ts
 - src/services/PreferencesService.ts
 - src/services/SpeechRecognitionService.ts
 - src/services/SpeechService.ts
 - src/services/StudentProfileService.ts
 - src/services/UniverseGenerationService.ts
 - src/services/UniverseGenerator.ts
 - src/services/UniverseSessionManager.ts
 - src/services/ai/CostGovernor.ts
 - src/services/ai/index.ts
 - src/services/aiContentRecommendationService.ts
 - src/services/aiCreativeDirector/atomSequenceBuilder.ts
 - src/services/aiCreativeDirector/educationalContextMapper.ts
 - src/services/aiCreativeDirector/questionGenerator.ts
 - src/services/aiCreativeDirector/types.ts
 - src/services/aiCreativeDirectorService.ts
 - src/services/aiInsightsScanner.ts
 - src/services/aiInteractionService.ts
 - src/services/aiLearningPathService.ts
 - src/services/commonStandardsAPI.ts
 - src/services/conceptMasteryService.ts
 - src/services/content/ContentGenerationService.ts
 - src/services/content/ContentOrchestrator.ts
 - src/services/content/EdgeContentService.ts
 - src/services/content/EnhancedContentGenerationService.ts
 - src/services/content/KnowledgeComponentService.ts
 - src/services/content/aiContentGenerator.ts
 - src/services/content/contentRepository.ts
 - src/services/content/index.ts
 - src/services/content/trainingGroundPromptBuilder.ts
 - src/services/content/trainingGroundPromptGenerator.ts
 - src/services/contentAtomRepository.ts
 - src/services/contentClient.ts
 - src/services/contentDeduplicationService.ts
 - src/services/curriculum/CurriculumIntegrationService.ts
 - src/services/curriculum/CurriculumService.test.ts
 - src/services/curriculum/CurriculumService.ts
 - src/services/curriculum/CurriculumServiceFactory.ts
 - src/services/curriculum/EnhancedCurriculumIntegrationService.ts
 - src/services/curriculum/MockCurriculumService.test.ts
 - src/services/curriculum/MockCurriculumService.ts
 - src/services/curriculum/UNESCOCurriculumService.ts
 - src/services/curriculum/core/CurriculumAIContext.ts
 - src/services/curriculum/core/CurriculumFilter.ts
 - src/services/curriculum/core/CurriculumServiceBase.ts
 - src/services/curriculum/core/CurriculumStats.ts
 - src/services/curriculum/curriculumData.ts
 - src/services/curriculum/curriculumIntegration.ts
 - src/services/curriculum/index.ts
 - src/services/curriculum/studyPugCurriculum.ts
 - src/services/curriculum/types.ts
 - src/services/curriculumManager.ts
 - src/services/curriculumService/index.ts
 - src/services/curriculumService/mockCurriculumService.ts
 - src/services/curriculumService/types.ts
 - src/services/dailyLearningPlanService.ts
 - src/services/dailyLearningSessionOrchestrator.ts
 - src/services/dailyLessonGenerator.ts
 - src/services/dailyLessonGenerator/activityContentGenerator.ts
 - src/services/dailyLessonGenerator/cacheService.ts
 - src/services/dailyLessonGenerator/curriculumService.ts
 - src/services/dailyLessonGenerator/studentProgressService.ts
 - src/services/dailyLessonGenerator/types.ts
 - src/services/dailyLessonOrchestrator.ts
 - src/services/dynamicLessonExtender.ts
 - src/services/enhancedFallbackGenerators.ts
 - src/services/gameAssignmentService.ts
 - src/services/globalQuestionUniquenessService.ts
 - src/services/gradeAlignedQuestionGeneration.ts
 - src/services/knowledgeComponentService.ts
 - src/services/learnerProfile/LearnerProfileService.ts
 - src/services/learnerProfile/MockLearnerProfileService.ts
 - src/services/learnerProfile/MockProfileService.ts
 - src/services/learnerProfile/ProfileRecommendationService.ts
 - src/services/learnerProfile/SupabaseProfileService.ts
 - src/services/learnerProfile/UserIdService.ts
 - src/services/learnerProfile/__tests__/MockLearnerProfileService.basic.test.ts
 - src/services/learnerProfile/__tests__/MockLearnerProfileService.kcMastery.test.ts
 - src/services/learnerProfile/__tests__/MockLearnerProfileService.overallMastery.test.ts
 - src/services/learnerProfile/__tests__/MockLearnerProfileService.store.test.ts
 - src/services/learnerProfile/index.ts
 - src/services/learnerProfile/integrationHelpers.ts
 - src/services/learnerProfile/masteryCalculator.ts
 - src/services/learnerProfile/mockStore.ts
 - src/services/learnerProfile/profileFactory.ts
 - src/services/learnerProfile/repositories/SupabaseKCMasteryRepository.ts
 - src/services/learnerProfile/repositories/SupabaseProfileRepository.ts
 - src/services/learnerProfile/types.ts
 - src/services/learnerProfile/utils/profileDataTransformers.ts
 - src/services/learnerProfileService.ts
 - src/services/learningPath/LearningPathService.ts
 - src/services/learningPath/index.ts
 - src/services/learningPath/pathGenerationService.ts
 - src/services/learningPath/pathwayManagementService.ts
 - src/services/learningPath/progressTrackingService.ts
 - src/services/learningPath/stepManagementService.ts
 - src/services/learningPath/types.ts
 - src/services/lessonProgressService.ts
 - src/services/mockUserProgressService.ts
 - src/services/mockUserProgressService/helpers.ts
 - src/services/mockUserProgressService/mockData.ts
 - src/services/mockUserProgressService/types.ts
 - src/services/nelie/NELIEEngine.main.ts
 - src/services/nelie/NELIESessionGenerator.main.ts
 - src/services/nelie/generator.ts
 - src/services/openaiContentService.ts
 - src/services/personalizedLearningPathGenerator.ts
 - src/services/progressPersistence.ts
 - src/services/prompt-system/dataMapping.ts
 - src/services/prompt-system/index.ts
 - src/services/psychometrics/bktCalculator.ts
 - src/services/questionTemplateSystem.ts
 - src/services/realTimeProgressService.ts
 - src/services/scalableQuestionGeneration.ts
 - src/services/sessionService.ts
 - src/services/simulator/SimulatorEngine.ts
 - src/services/stable-question-system/questionGenerator.ts
 - src/services/stable-question-system/stableQuestionTemplateSystem.ts
 - src/services/stable-question-system/templates.ts
 - src/services/stable-question-system/types.ts
 - src/services/stableQuestionTemplateSystem.ts
 - src/services/staticDataService.ts
 - src/services/stealthAssessment/StealthAssessmentService.ts
 - src/services/stealthAssessment/config.ts
 - src/services/stealthAssessment/eventMetadataGenerator.ts
 - src/services/stealthAssessment/eventQueue.ts
 - src/services/stealthAssessment/index.ts
 - src/services/stealthAssessment/supabaseEventLogger.ts
 - src/services/stealthAssessment/types.ts
 - src/services/stealthAssessment/userUtils.ts
 - src/services/stealthAssessmentService.ts
 - src/services/subjectQuestionService.ts
 - src/services/supabaseClient.ts
 - src/services/teachingPerspectiveService.ts
 - src/services/types/contentTypes.ts
 - src/services/unifiedQuestionGeneration.ts
 - src/services/universe-generator.ts
 - src/services/useTrainingGroundContent.ts
 - src/services/userActivityService.ts
 - src/services/userLearningProfileService.ts
 - src/services/userProgressService.ts
 - src/shared/ui/NotFound.tsx
 - src/shared/ui/ProtectedRoute.tsx
 - src/temp-build-fix.ts
 - src/test/gameSystemVerification.ts
 - src/test/integration/AIUniverseGenerator.test.ts
 - src/test/integration/OpenAIService.test.ts
 - src/test/integration/questionSystem.test.ts
 - src/test/integration/supabase.test.ts
 - src/test/setup.ts
 - src/test/unit/AIUniverseGenerator.test.ts
 - src/test/unit/App.test.tsx
 - src/test/unit/UniversePage.test.tsx
 - src/test/unit/curriculumMapper.test.ts
 - src/test/unit/enhancedLessonSystem.test.ts
 - src/test/unit/gameSystem.test.ts
 - src/test/unit/imports.test.ts
 - src/test/unit/personalizationEngine.test.ts
 - src/test/unit/unifiedQuestionGeneration.test.ts
 - src/test/unit/universeGenerator.test.ts
 - src/types/admin.ts
 - src/types/auth.ts
 - src/types/calendar.ts
 - src/types/communication.ts
 - src/types/content.ts
 - src/types/curriculum.ts
 - src/types/curriculum/CurriculumFilters.ts
 - src/types/curriculum/CurriculumValidation.ts
 - src/types/curriculum/SubjectConstants.ts
 - src/types/curriculum/SubjectMetadata.ts
 - src/types/curriculum/UnifiedCurriculumNode.ts
 - src/types/curriculum/index.ts
 - src/types/database.ts
 - src/types/env.d.ts
 - src/types/global.d.ts
 - src/types/gradeStandards.ts
 - src/types/interaction.ts
 - src/types/jules.ts
 - src/types/knowledgeComponent.ts
 - src/types/learner.ts
 - src/types/learnerProfile.ts
 - src/types/learning.ts
 - src/types/lessonCoverage.ts
 - src/types/nelie/NELIESubjects.main.ts
 - src/types/phase1-stubs.d.ts
 - src/types/scenario.ts
 - src/types/school.ts
 - src/types/simulator/SimulatorTypes.ts
 - src/types/stealthAssessment.ts
 - src/types/student.ts
 - src/types/studentProfile.ts
 - src/types/supabase.ts
 - src/types/teacher.ts
 - src/types/training-ground.ts
 - src/types/ts-suppress.ts
 - src/types/universe.ts
 - src/types/user.ts
 - src/utils/CacheBuster.ts
 - src/utils/CrossOriginHandler.ts
 - src/utils/RealtimeAudio.ts
 - src/utils/adaptiveLearningUtils.ts
 - src/utils/backgroundRemoval.ts
 - src/utils/julesMessenger.ts
 - src/utils/localizationTestHelper.ts
 - src/utils/messageHandlers.ts
 - src/utils/originChecker.ts
 - src/vite-env.d.ts
```

## Grep focus (createClient, supabase-js, Scenario*, ContentGenerationService)
```
 --- FILE: src/components/layout/NavbarDesktopMenu.tsx
 --- FILE: src/components/layout/NavbarUserMenu.tsx
 --- FILE: src/components/scenario-engine/ScenarioPlayer.tsx
 --- FILE: src/components/scenario-engine/hooks/useScenarioEventLogging.ts
 --- FILE: src/features/daily-program/pages/ScenarioRunner.tsx
 --- FILE: src/hooks/useAuth.tsx
 --- FILE: src/integrations/supabase/client.ts
 --- FILE: src/lib/supabaseClient.ts
 --- FILE: src/pages/ConsolidatedSimulatorPage.tsx
 --- FILE: src/pages/ScenarioPlayerPage.tsx
 --- FILE: src/pages/SimulationsPage.tsx
 --- FILE: src/services/ContentGenerationService.ts
 --- FILE: src/services/content/ContentGenerationService.ts
 --- FILE: src/services/content/EnhancedContentGenerationService.ts
 --- FILE: src/test/integration/supabase.test.ts
 --- FILE: src/types/auth.ts
 --- FILE: src/types/user.ts
```

## Key files

### src/App.tsx
```tsx
// src/components/NELIE/NELIE.tsx
import React, { useState, useRef, useEffect } from "react";
import { useUnifiedSpeech } from "@/hooks/useUnifiedSpeech";

type Pos = { x: number; y: number };

export default function NELIE() {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState<Pos>({ x: 24, y: 24 });
  const [rel, setRel] = useState<Pos>({ x: 0, y: 0 });
  const startPosRef = useRef<Pos | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { speakAsNelie } = useUnifiedSpeech();

  useEffect(() => {
    const onMove = (x: number, y: number) =>
      setPos({ x: x - rel.x, y: y - rel.y });

    const mm = (e: MouseEvent) => dragging && onMove(e.pageX, e.pageY);
    const mu = () => setDragging(false);

    const tm = (e: TouchEvent) => {
      if (!dragging) return;
      const t = e.touches[0];
      if (t) onMove(t.pageX, t.pageY);
    };
    const tu = () => setDragging(false);

    document.addEventListener("mousemove", mm);
    document.addEventListener("mouseup", mu);
    document.addEventListener("touchmove", tm, { passive: false });
    document.addEventListener("touchend", tu);

    return () => {
      document.removeEventListener("mousemove", mm);
      document.removeEventListener("mouseup", mu);
      document.removeEventListener("touchmove", tm);
      document.removeEventListener("touchend", tu);
    };
  }, [dragging, rel]);

  const beginDrag = (pageX: number, pageY: number) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setDragging(true);
    setRel({ x: pageX - r.left, y: pageY - r.top });
    startPosRef.current = { x: pageX, y: pageY };
  };

  const onMouseDown = (e: React.MouseEvent) => {
    beginDrag(e.pageX, e.pageY);
    e.preventDefault();
    e.stopPropagation();
  };
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    beginDrag(t.pageX, t.pageY);
    e.preventDefault();
    e.stopPropagation();
  };

  const onClick = () => {
    const s = startPosRef.current;
    if (!s) return setOpen((v) => !v);
    const moved = Math.abs(pos.x - (s.x - rel.x)) + Math.abs(pos.y - (s.y - rel.y)) > 6;
    if (!moved) setOpen((v) => !v);
    startPosRef.current = null;
  };

  return (
    <>
      <div
        ref={ref}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onClick={onClick}
        role="button"
        aria-label="NELIE"
        className="fixed z-[9999] w-24 h-24 cursor-move select-none"
        style={{ left: pos.x, top: pos.y, background: "transparent" }}
      >
        <img
          src="/nelie.png"
          alt="NELIE"
          className="nelie-avatar w-full h-full pointer-events-none"
          draggable={false}
        />
      </div>

      {open && (
        <div
          className="fixed z-[10000] w-80 rounded-lg shadow-xl p-3 bg-white dark:bg-neutral-900 border border-black/5"
          style={{ left: pos.x - 280, top: pos.y - 20 }}
        >
          <div className="font-bold text-blue-600 dark:text-blue-400 mb-2">NELIE</div>
          <textarea
            className="w-full border rounded p-2 text-sm bg-white/70 dark:bg-neutral-800"
            rows={4}
            placeholder="Skriv til NELIE..."
          />
          <button
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-1 text-sm"
            onClick={() => speakAsNelie("Hej, jeg er NELIE. Hvad vil du lære i dag?")}
          >
            🔊 Tal
          </button>
        </div>
      )}
    </>
  );
}
```

### src/features/daily-program/pages/ScenarioRunner.tsx
```tsx
// src/features/daily-program/pages/ScenarioRunner.tsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { buildContentRequest, normalizeGrade } from "@/content";
import { generateLesson } from "@/services/contentClient";

type Json = Record<string, any>;

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const SUBJECT_ALIASES: Record<string, string> = {
  science: "Science",
  math: "Mathematics",
  maths: "Mathematics",
  language: "Language lab",
  history: "History & Religion",
  geography: "Geography",
  tech: "Computer and technology",
};

export default function ScenarioRunner() {
  const { scenarioId = "demo" } = useParams();
  const qs = useQuery();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<Json | null>(null);

  const subject = useMemo(() => {
    const fromQs = qs.get("subject");
    if (fromQs) return SUBJECT_ALIASES[fromQs.toLowerCase()] ?? fromQs;
    return SUBJECT_ALIASES[scenarioId.toLowerCase()] ?? "Science";
  }, [qs, scenarioId]);

  const grade = useMemo(() => normalizeGrade(qs.get("grade") ?? 5), [qs]);
  const learningStyle = useMemo(() => qs.get("learningStyle") ?? "mixed", [qs]);
  const ability = useMemo(() => qs.get("ability") ?? "standard", [qs]);
  const interests = useMemo(() => {
    const raw = qs.get("interests");
    if (!raw) return [] as string[];
    return raw.split(",").map((s) => s.trim()).filter(Boolean);
  }, [qs]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      setContent(null);
      try {
        const request = buildContentRequest({
          subject,
          grade,
          curriculum: qs.get("curriculum"),
          ability,
          learningStyle,
          interests,
          schoolPhilosophy: qs.get("schoolPhilosophy"),
          lessonDurationMins: Number(qs.get("duration")) || 45,
          calendarKeywords: (qs.get("calendar") ?? "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          calendarDurationDays: Number(qs.get("calendarDays")) || 1,
        });
        const result = await generateLesson(request);
        if (!cancelled) setContent(result);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [subject, grade, learningStyle, ability, interests, qs]);

  const title =
    (content as any)?.title ??
    (content as any)?.lesson?.title ??
    `${subject} Scenario (Grade ${grade})`;

  const firstActivity: Json | undefined =
    (content as any)?.lesson?.activities?.[0] ??
    (content as any)?.activities?.[0] ??
    (content as any)?.game?.steps?.[0];

  const reflection: string | undefined =
    (content as any)?.lesson?.reflection ??
    (content as any)?.reflection;

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">
          Scenario ID: <span className="font-mono">{scenarioId}</span> • Subject: {subject} • Grade: {grade} • Style: {learningStyle} • Ability: {ability}
        </p>
        <div className="text-xs text-muted-foreground">
          Tip: <code>?subject=Science&grade=5&interests=basketball,space</code>
        </div>
      </header>

      {loading && (
        <div className="rounded-xl border p-6 animate-pulse">
          <div className="h-4 w-1/3 rounded bg-gray-300" />
          <div className="mt-4 h-3 w-2/3 rounded bg-gray-200" />
          <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-800">
          <div className="font-medium">Fejl ved indholds-generering</div>
          <div className="text-sm mt-1">{error}</div>
          <div className="text-xs mt-2 text-red-700/80">
            Tjek at <code>.env.local</code> har <code>VITE_SUPABASE_URL</code> og <code>VITE_SUPABASE_ANON</code>.
          </div>
        </div>
      )}

      {!loading && !error && content && (
        <section className="space-y-6">
          {firstActivity && (
            <div className="rounded-xl border p-6">
              <h2 className="text-lg font-semibold">Aktivitet</h2>
              <p className="mt-2 whitespace-pre-wrap">
                {firstActivity.description || firstActivity.text || JSON.stringify(firstActivity)}
              </p>
              {Array.isArray(firstActivity.steps) && (
                <ol className="mt-4 list-decimal pl-6 space-y-1">
                  {firstActivity.steps.map((s: any, i: number) => (
                    <li key={i} className="whitespace-pre-wrap">
                      {typeof s === "string" ? s : s?.text ?? JSON.stringify(s)}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}

          {reflection && (
            <div className="rounded-xl border p-6">
              <h2 className="text-lg font-semibold">Refleksion</h2>
              <p className="mt-2 whitespace-pre-wrap">{reflection}</p>
            </div>
          )}

          <details className="rounded-xl border p-4">
            <summary className="cursor-pointer text-sm font-medium">Rå data (debug)</summary>
            <pre className="mt-3 overflow-auto text-xs leading-relaxed">
              {JSON.stringify(content, null, 2)}
            </pre>
          </details>
        </section>
      )}

      {!loading && !error && !content && (
        <div className="text-sm text-muted-foreground">Intet indhold endnu.</div>
      )}
    </div>
  );
}
```

### src/services/supabaseClient.ts
```ts
// src/services/supabaseClient.ts
import supabaseDefault, { getSupabase, supabase } from "@/lib/supabaseClient";
export { getSupabase, supabase };
export default supabaseDefault;
```

### src/services/contentClient.ts
```ts
// src/services/contentClient.ts
import { getSupabase } from "@/lib/supabaseClient";

/** Kald Supabase Edge Function `generate-content` */
export async function generateLesson(body: unknown): Promise<any> {
  const supabase = getSupabase();
  const { data, error } = await supabase.functions.invoke("generate-content", { body });
  if (error) throw error;
  return (data as any)?.data ?? data;
}
```

### src/content/index.ts
```ts
// src/content/index.ts
export type LessonParams = {
  subject: string;
  grade: number | string;
  curriculum?: string | null;
  ability?: "remedial" | "standard" | "advanced" | string;
  learningStyle?: string;
  interests?: string[] | string | null;
  schoolPhilosophy?: string | null;
  teacherWeights?: Record<string, number> | null;
  lessonDurationMins?: number | null;
  calendarKeywords?: string[] | null;
  calendarDurationDays?: number | null;
};

export function normalizeGrade(input: number | string): number {
  if (typeof input === "number" && Number.isFinite(input)) return input;
  const m = String(input ?? "").match(/\d+/);
  return m ? Math.max(0, parseInt(m[0], 10)) : 0;
}

export function buildContentRequest(params: LessonParams) {
  const grade = normalizeGrade(params.grade);
  const ability = params.ability ?? "standard";
  const learningStyle = params.learningStyle ?? "mixed";
  const interestsArr = Array.isArray(params.interests)
    ? params.interests
    : params.interests
    ? [params.interests]
    : [];

  return {
    subject: params.subject,
    grade,
    curriculum: params.curriculum ?? null,
    ability,
    learningStyle,
    interests: interestsArr,
    context: {
      schoolPhilosophy: params.schoolPhilosophy ?? null,
      teacherWeights: params.teacherWeights ?? null,
      lessonDurationMins: params.lessonDurationMins ?? 45,
      calendar: {
        keywords: params.calendarKeywords ?? [],
        durationDays: params.calendarDurationDays ?? 1,
      },
    },
  };
}

export default { buildContentRequest, normalizeGrade };
```

### src/services/ContentGenerationService.ts
```ts
// src/services/ContentGenerationService.ts
import { buildContentRequest, normalizeGrade } from "../content";
import { generateLesson } from "./contentClient";

export type ContentGenerationRequest = ReturnType<typeof buildContentRequest>;
export type Atom = { type: string; text?: string; data?: any; steps?: any[] };
export type AtomSequence = Atom[];

export class ContentGenerationService {
  async generate(params: {
    subject: string;
    grade: number | string;
    curriculum?: string | null;
    ability?: "remedial" | "standard" | "advanced" | string;
    learningStyle?: string;
    interests?: string[] | string | null;
    schoolPhilosophy?: string | null;
    teacherWeights?: Record<string, number> | null;
    lessonDurationMins?: number | null;
    calendarKeywords?: string[] | null;
    calendarDurationDays?: number | null;
  }) {
    const body = buildContentRequest(params);
    return await generateLesson(body);
  }

  // Bagudkompatible helpers
  static normalizeGrade = normalizeGrade;
  static buildRequest = buildContentRequest;
}

export const contentGenerationService = new ContentGenerationService();
export default contentGenerationService;
```

### src/services/content/ContentGenerationService.ts
```ts
// src/services/content/ContentGenerationService.ts
import { buildContentRequest, normalizeGrade } from "../../content";
import { generateLesson } from "../contentClient";

export type ContentGenerationRequest = ReturnType<typeof buildContentRequest>;
export type Atom = { type: string; text?: string; data?: any; steps?: any[] };
export type AtomSequence = Atom[];

class ContentGenerationService {
  async generate(params: Parameters<typeof buildContentRequest>[0]) {
    const body = buildContentRequest(params);
    return await generateLesson(body);
  }

  // Instance helpers (bevarer tidligere API)
  normalizeGrade = normalizeGrade;
  buildRequest = buildContentRequest;
}

export default new ContentGenerationService();
export { ContentGenerationService };
```

### vite.config.ts
```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@features": path.resolve(__dirname, "src/features"),
      "@services": path.resolve(__dirname, "src/services"),
    },
  },
  server: {
    port: 5173,
  },
});
```

### tsconfig.base.json
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@core/*": ["src/core/*"],
      "@features/*": ["src/features/*"],
      "@ui/*": ["src/shared/ui/*"],
      "@lib/*": ["src/shared/lib/*"],
      "@config/*": ["src/shared/config/*"],
      "@stores/*": ["src/shared/stores/*"],
      "@types/*": ["src/core/domain/types/*"]
    }
  }
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@content": ["src/services/content/index.ts"],
      "@content/edge": ["src/services/content/EdgeContentService.ts"],
      "@content/openai": ["src/services/openai/OpenAIContentService.ts"]
    }
  }
}
```
