# Context Snapshot – main

## File tree (src/)
```
 - src/App.css
 - src/App.tsx
 - src/App.tsx.bak
 - src/agents/contentAgent.ts
 - src/agents/fallbacks.ts
 - src/agents/imageAgent.ts
 - src/agents/index.ts
 - src/agents/logger.ts
 - src/agents/qaAgent.ts
 - src/agents/simulatorAgent.ts
 - src/agents/types.ts
 - src/ai/contentService.ts
 - src/ai/promptBuilder.ts
 - src/ai/prompts/dailyUniverse.v3.ts
 - src/ai/types.ts
 - src/assets/fallback-images/default.png
 - src/assets/fallback-images/math.png
 - src/assets/fallback-images/science.png
 - src/build-notes.ts
 - src/build-suppressions.ts
 - src/components/AITutor.tsx
 - src/components/AuthHandler.tsx
 - src/components/AuthModal.tsx
 - src/components/CoverGeneratorDemo.tsx
 - src/components/EnhancedAITutor.tsx
 - src/components/EnhancedNELIELessonManager.tsx
 - src/components/ErrorBoundary.tsx
 - src/components/GameHub.tsx
 - src/components/GenerateCoverButton.tsx
 - src/components/GenerateCoverDebug
 - src/components/JulesIntegration.tsx
 - src/components/LanguageSwitcher.tsx
 - src/components/LessonStream.tsx
 - src/components/NELIE.tsx
 - src/components/OpenAIApiTest.tsx
 - src/components/ProfileDebugButton.tsx
 - src/components/ProfileServiceTest.tsx
 - src/components/ProgressDashboard.tsx
 - src/components/ProtectedRoute.tsx
 - src/components/RefactoredFloatingAITutor.tsx
 - src/components/RoleSwitcher.tsx
 - src/components/SiteMap.tsx
 - src/components/SubscriptionPlans.tsx
 - src/components/ThemeProvider.tsx
 - src/components/UniverseCover.tsx
 - src/components/UniverseCreateForm.tsx
 - src/components/UniverseImage.tsx
 - src/components/UniverseImageDiagnostic.tsx
 - src/components/UniversePlayer.tsx
 - src/components/UserVerificationDebug.tsx
 - src/components/activities/EducationalGameEngine.tsx
 - src/components/adaptive-learning/AILearningDashboard.tsx
 - src/components/adaptive-learning/AILearningModule.tsx
 - src/components/adaptive-learning/AdaptiveLearningAtomRenderer.tsx
 - src/components/adaptive-learning/AdaptivePracticeModule.tsx
 - src/components/adaptive-learning/LearningModeSelector.tsx
 - src/components/adaptive-learning/components/FocusedGrade3MultiplicationTest.tsx
 - src/components/adaptive-learning/components/FocusedGrade3Test.tsx
 - src/components/adaptive-learning/components/Grade3FractionTestTrigger.tsx
 - src/components/adaptive-learning/components/QuestionCard.tsx
 - src/components/admin/BulkImageGenerator.tsx
 - src/components/admin/RepairCoversButton.tsx
 - src/components/admin/UniverseImageManager.tsx
 - src/components/ai-tutor/SubjectSelector.tsx
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
 - src/components/curriculum/CurriculumDashboard.tsx
 - src/components/curriculum/LessonForm.tsx
 - src/components/curriculum/LessonList.tsx
 - src/components/daily-program/AIEnhancedActivityCard.tsx
 - src/components/daily-program/ActivityCard.tsx
 - src/components/daily-program/EnhancedDailyProgram.tsx
 - src/components/daily-program/NeliesTips.tsx
 - src/components/daily-program/TodaysProgramGrid.tsx
 - src/components/daily-program/WelcomeCard.tsx
 - src/components/daily-program/dailyActivitiesData.ts
 - src/components/demo/GameAssignmentDemo.tsx
 - src/components/dev/DevLessonQA.tsx
 - src/components/dev/DevRegenerateButton.tsx
 - src/components/dev/UniverseImageDebug.tsx
 - src/components/education/EnhancedActivityRenderer.tsx
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
 - src/components/education/components/OptimizedQuestionActivity.tsx
 - src/components/education/components/ProgressIndicator.tsx
 - src/components/education/components/QuestionDisplay.tsx
 - src/components/education/components/QuestionResult.tsx
 - src/components/education/components/StandardLessonProgressIndicator.tsx
 - src/components/education/components/TrainingGroundActivityRenderer.tsx
 - src/components/education/components/UnifiedClassIntroductionProgress.tsx
 - src/components/education/components/UnifiedLessonControls.tsx
 - src/components/education/components/WorldClassTeachingTemplate.tsx
 - src/components/education/components/hooks/useEnhancedTeachingEngine.ts
 - src/components/education/components/hooks/useOptimizedLessonManager.ts
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
 - src/components/education/components/utils/NELIESessionGenerator.ts
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
 - src/constants/feature-flags.ts
 - src/constants/lesson.ts
 - src/constants/school.ts
 - src/content/types.ts
 - src/content/universe.catalog.ts
 - src/contexts/RoleContext.tsx
 - src/data/CurriculumStepGradeMap.ts
 - src/data/ai-curriculum.json
 - src/data/comingSoonGames.ts
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
 - src/games/components/MicroGameHost.tsx
 - src/games/fast-facts.tsx
 - src/games/registry.ts
 - src/games/types.ts
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
 - src/hooks/useDevThrottleClick.ts
 - src/hooks/useEduLocalization.ts
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
 - src/hooks/useSetting.ts
 - src/hooks/useSimpleMobileSpeech.ts
 - src/hooks/useSimpleRoleAccess.ts
 - src/hooks/useSimplifiedSpeech.ts
 - src/hooks/useSoundEffects.ts
 - src/hooks/useUnifiedQuestionGeneration.ts
 - src/hooks/useUnifiedSpeech.ts
 - src/hooks/useUniverseCover.ts
 - src/hooks/useUniverseImage.ts
 - src/i18n.ts
 - src/index.css
 - src/integrations/supabase/client.ts
 - src/integrations/supabase/types.ts
 - src/lib/build-suppress.ts
 - src/lib/env.ts
 - src/lib/functions.ts
 - src/lib/generateCover.ts
 - src/lib/grade.ts
 - src/lib/gradeBand.ts
 - src/lib/gradeLabels.ts
 - src/lib/imageProfiles.test.ts
 - src/lib/imageProfiles.ts
 - src/lib/supabaseClient.ts
 - src/lib/utils.ts
 - src/locales/da/translation.json
 - src/locales/en/translation.json
 - src/locales/es/translation.json
 - src/main.tsx
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
 - src/pages/Calendar.tsx
 - src/pages/CalendarPage.tsx
 - src/pages/CommunicationCenter.tsx
 - src/pages/CommunicationPage.tsx
 - src/pages/ConsolidatedSimulatorPage.tsx
 - src/pages/CreateUniverse.tsx
 - src/pages/CurriculumEditorPage.tsx
 - src/pages/CurriculumSystem.tsx
 - src/pages/DailyLearningSessionPage.tsx
 - src/pages/DailyProgramPage.tsx
 - src/pages/DailyUniverseLessonPage.tsx
 - src/pages/Dashboard.tsx
 - src/pages/DevEventsPage.tsx
 - src/pages/DevSettingsInspector.tsx
 - src/pages/EducationPage.tsx
 - src/pages/GameHub.tsx
 - src/pages/GameHubPage.tsx
 - src/pages/GamePage.tsx
 - src/pages/GamesPage.tsx
 - src/pages/HomePage.tsx
 - src/pages/Index.tsx
 - src/pages/LandingPage.tsx
 - src/pages/LearningPathway.tsx
 - src/pages/LocalizationTestPage.tsx
 - src/pages/MathPage.tsx
 - src/pages/MathematicsLearningPage.tsx
 - src/pages/MusicLesson.tsx
 - src/pages/MyUniverses.tsx
 - src/pages/NotFound.tsx
 - src/pages/ParentDashboard.tsx
 - src/pages/ParentPage.tsx
 - src/pages/PreferencesPage.tsx
 - src/pages/Profile.tsx
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
 - src/pages/TeacherPlanning.tsx
 - src/pages/TestPage.tsx
 - src/pages/TestingPage.tsx
 - src/pages/TodaysProgram.tsx
 - src/pages/TrainingGround.tsx
 - src/pages/UniverseDetail.tsx
 - src/pages/UniversePage.tsx
 - src/pages/admin/UniverseAdminPage.tsx
 - src/pages/cover-test.tsx
 - src/pages/dev/RouteInventory.tsx
 - src/pages/dev/UniverseQAPage.tsx
 - src/scripts/exportInteractionEvents.ts
 - src/scripts/populateKnowledgeComponents.ts
 - src/services/AIUniverseGenerator.ts
 - src/services/AdaptiveDifficultyEngine.ts
 - src/services/AdaptiveUniverseGenerator.ts
 - src/services/CalendarService.ts
 - src/services/ContentGenerationService.ts
 - src/services/CurriculumMapper.ts
 - src/services/DynamicNarrativeService.ts
 - src/services/EnhancedLessonGenerator.ts
 - src/services/EnhancedSubjectLessonFactory.ts
 - src/services/InSessionAdaptiveManager.ts
 - src/services/NELIEEngine.ts
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
 - src/services/UniverseImageGenerator.ts
 - src/services/UniverseSessionManager.ts
 - src/services/ai/validators/lessonQuality.ts
 - src/services/aiContentRecommendationService.ts
 - src/services/aiCreativeDirector/atomSequenceBuilder.ts
 - src/services/aiCreativeDirector/educationalContextMapper.ts
 - src/services/aiCreativeDirector/questionGenerator.ts
 - src/services/aiCreativeDirector/types.ts
 - src/services/aiCreativeDirectorService.ts
 - src/services/aiInsightsScanner.ts
 - src/services/aiInteractionService.ts
 - src/services/aiLearningPathService.ts
 - src/services/cache/LessonCache.ts
 - src/services/calendar.ts
 - src/services/commonStandardsAPI.ts
 - src/services/conceptMasteryService.ts
 - src/services/content/ContentGenerationService.ts
 - src/services/content/ContentOrchestrator.ts
 - src/services/content/EnhancedContentGenerationService.ts
 - src/services/content/KnowledgeComponentService.ts
 - src/services/content/aiContentGenerator.ts
 - src/services/content/aiGlue.ts
 - src/services/content/aiPlannerActivityPipeline.ts
 - src/services/content/beatToActivities.ts
 - src/services/content/contentRepository.ts
 - src/services/content/fallbackContentService.ts
 - src/services/content/offlineScheduler.ts
 - src/services/content/strictParamsGate.ts
 - src/services/content/trainingGroundPromptBuilder.ts
 - src/services/content/trainingGroundPromptGenerator.ts
 - src/services/content/unifiedLessonContext.ts
 - src/services/contentAtomRepository.ts
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
 - src/services/edu/effectiveContext.ts
 - src/services/edu/format.ts
 - src/services/edu/loadOverrides.ts
 - src/services/edu/locale.ts
 - src/services/edu/textTokens.ts
 - src/services/enhancedFallbackGenerators.ts
 - src/services/gameAssignmentService.ts
 - src/services/globalQuestionUniquenessService.ts
 - src/services/gradeAlignedQuestionGeneration.ts
 - src/services/interestProfile.ts
 - src/services/interestSignals.ts
 - src/services/knowledgeComponentService.ts
 - src/services/leaderboard.ts
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
 - src/services/lesson/buildDailyLesson.ts
 - src/services/lessonBuilder.ts
 - src/services/lessonProgressService.ts
 - src/services/lessonSchema.ts
 - src/services/lessonSourceManager.ts
 - src/services/media/imagePrefetch.ts
 - src/services/mockUserProgressService.ts
 - src/services/mockUserProgressService/helpers.ts
 - src/services/mockUserProgressService/mockData.ts
 - src/services/mockUserProgressService/types.ts
 - src/services/openaiContentService.ts
 - src/services/personalizedLearningPathGenerator.ts
 - src/services/progressPersistence.ts
 - src/services/prompt-system/dataMapping.ts
 - src/services/prompt-system/index.ts
 - src/services/promptService.ts
 - src/services/psychometrics/bktCalculator.ts
 - src/services/quality/guard.ts
 - src/services/quality/rubric.ts
 - src/services/questionTemplateSystem.ts
 - src/services/realTimeProgressService.ts
 - src/services/scalableQuestionGeneration.ts
 - src/services/sessionService.ts
 - src/services/settings.ts
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
 - src/services/storage/getSignedUrl.ts
 - src/services/storage/objectExists.ts
 - src/services/storage/signForDownload.ts
 - src/services/subjectChoice.ts
 - src/services/subjectQuestionService.ts
 - src/services/teachingPerspectiveService.ts
 - src/services/telemetry/events.ts
 - src/services/types/contentTypes.ts
 - src/services/unifiedQuestionGeneration.ts
 - src/services/universe-generator.ts
 - src/services/universe/aiGlue.ts
 - src/services/universe/arcs.ts
 - src/services/universe/lessonBuilder.ts
 - src/services/universe/offlineScheduler.ts
 - src/services/universe/persist.ts
 - src/services/universe/prompts.ts
 - src/services/universe/scheduler.ts
 - src/services/universe/simulation.ts
 - src/services/universe/state.ts
 - src/services/universeBrief.ts
 - src/services/universeContentService.ts
 - src/services/universeImages.ts
 - src/services/useTrainingGroundContent.ts
 - src/services/user/locale.ts
 - src/services/userActivityService.ts
 - src/services/userLearningProfileService.ts
 - src/services/userProgressService.ts
 - src/shared/contracts.ts
 - src/supabase/functionsClient.ts
 - src/supabase/safeInvoke.ts
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
 - src/types/api.ts
 - src/types/auth.ts
 - src/types/calendar.ts
 - src/types/communication.ts
 - src/types/content.ts
 - src/types/contentTypes.ts
 - src/types/curriculum.ts
 - src/types/curriculum/CurriculumFilters.ts
 - src/types/curriculum/CurriculumValidation.ts
 - src/types/curriculum/NELIESubjects.ts
 - src/types/curriculum/SubjectConstants.ts
 - src/types/curriculum/SubjectMetadata.ts
 - src/types/curriculum/UnifiedCurriculumNode.ts
 - src/types/curriculum/index.ts
 - src/types/database.ts
 - src/types/global.d.ts
 - src/types/gradeStandards.ts
 - src/types/interaction.ts
 - src/types/jules.ts
 - src/types/knowledgeComponent.ts
 - src/types/learner.ts
 - src/types/learnerProfile.ts
 - src/types/learning.ts
 - src/types/lessonCoverage.ts
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
 - src/utils/__tests__/curriculumTargets.defaults.test.ts
 - src/utils/__tests__/curriculumTargets.flags.test.ts
 - src/utils/__tests__/curriculumTargets.test.ts
 - src/utils/adaptiveLearningUtils.ts
 - src/utils/bucketDetection.ts
 - src/utils/cache.ts
 - src/utils/cacheAuth.ts
 - src/utils/contentSource.ts
 - src/utils/country.ts
 - src/utils/coverKey.ts
 - src/utils/curriculumTargets.dk.ts
 - src/utils/curriculumTargets.ts
 - src/utils/devConsoleFilter.ts
 - src/utils/devCountry.ts
 - src/utils/featureFlags.ts
 - src/utils/grade.ts
 - src/utils/imageUrl.ts
 - src/utils/julesMessenger.ts
 - src/utils/localizationTestHelper.ts
 - src/utils/messageHandlers.ts
 - src/utils/observability.ts
 - src/utils/originChecker.ts
 - src/utils/session.ts
 - src/utils/singleflight.ts
 - src/utils/storageUrls.ts
 - src/utils/subjectMap.ts
 - src/utils/subjects.ts
 - src/utils/url.ts
 - src/vite-env.d.ts
```

## Grep focus (createClient, supabase-js, Scenario*, ContentGenerationService)
```
 --- FILE: src/components/layout/NavbarDesktopMenu.tsx
 --- FILE: src/components/layout/NavbarUserMenu.tsx
 --- FILE: src/components/scenario-engine/ScenarioPlayer.tsx
 --- FILE: src/components/scenario-engine/hooks/useScenarioEventLogging.ts
 --- FILE: src/hooks/useAuth.tsx
 --- FILE: src/integrations/supabase/client.ts
 --- FILE: src/lib/supabaseClient.ts
 --- FILE: src/pages/ConsolidatedSimulatorPage.tsx
 --- FILE: src/pages/ScenarioPlayerPage.tsx
 --- FILE: src/pages/SimulationsPage.tsx
 --- FILE: src/services/ContentGenerationService.ts
 --- FILE: src/services/content/ContentGenerationService.ts
 --- FILE: src/services/content/EnhancedContentGenerationService.ts
 --- FILE: src/types/auth.ts
 --- FILE: src/types/user.ts
```

## Key files

### src/App.tsx
```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import TrainingGround from "./pages/TrainingGround";
import SchoolDashboard from "./pages/SchoolDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import ProfilePage from "./pages/ProfilePage";
import SiteMapPage from "./pages/SiteMapPage";
import CalendarPage from "./pages/CalendarPage";
import SubjectLearningPage from "./pages/SubjectLearningPage";
import DailyLearningSessionPage from "./pages/DailyLearningSessionPage";

import DailyProgramPage from "@features/daily-program/pages/DailyProgramPage";
import DailyUniverseLessonPage from "@features/daily-program/pages/UniverseLesson";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public */}
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/sitemap" element={<SiteMapPage />} />

        {/* protected */}
        <Route
          path="/training-ground"
          element={<ProtectedRoute><TrainingGround /></ProtectedRoute>}
        />
        <Route
          path="/daily-program"
          element={<ProtectedRoute><DailyProgramPage /></ProtectedRoute>}
        />
        <Route
          path="/daily-universe-lesson"
          element={<ProtectedRoute><DailyUniverseLessonPage /></ProtectedRoute>}
        />
        <Route
          path="/school-dashboard"
          element={<ProtectedRoute><SchoolDashboard /></ProtectedRoute>}
        />
        <Route
          path="/teacher-dashboard"
          element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>}
        />
        <Route
          path="/parent-dashboard"
          element={<ProtectedRoute><ParentDashboard /></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
        />
        <Route
          path="/calendar"
          element={<ProtectedRoute><CalendarPage /></ProtectedRoute>}
        />
        <Route
          path="/subject/:subject"
          element={<ProtectedRoute><SubjectLearningPage /></ProtectedRoute>}
        />
        <Route
          path="/daily-session"
          element={<ProtectedRoute><DailyLearningSessionPage /></ProtectedRoute>}
        />

        {/* fallback */}
        <Route path="*" element={<Index />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### src/services/ContentGenerationService.ts
```ts
import curriculumIndex from '../data/unified-curriculum-index.json';
import type { CurriculumNode } from '../types/curriculum';
import { universeGenerationService } from './UniverseGenerationService';

class ContentGenerationService {
  private curriculum: { [key: string]: CurriculumNode } = {};

  constructor() {
    // Convert the imported JSON data to proper CurriculumNode objects
    this.curriculum = Object.keys(curriculumIndex).reduce((acc, key) => {
      const rawNode = curriculumIndex[key as keyof typeof curriculumIndex] as any;
      acc[key] = {
        id: key,
        parentId: rawNode.parentId || null,
        name: rawNode.name || 'Unnamed Node',
        ...rawNode,
        nodeType: String(rawNode.nodeType)
      } as CurriculumNode;
      return acc;
    }, {} as { [key: string]: CurriculumNode });
  }

  public getCurriculumNodeById(id: string): CurriculumNode | undefined {
    return this.curriculum[id];
  }

  public findNodesBySubject(subject: string): CurriculumNode[] {
    return Object.values(this.curriculum).filter(node => node.subjectName === subject);
  }

  public findNodesByGrade(grade: string): CurriculumNode[] {
    return Object.values(this.curriculum).filter(node => node.educationalLevel === grade);
  }

  public generateDailyUniverse(studentProfile: any): any {
    return universeGenerationService.generate(studentProfile);
  }
}

export const contentGenerationService = new ContentGenerationService();
```

### src/services/content/ContentGenerationService.ts
```ts
import { supabase } from '@/lib/supabaseClient';
import { invokeFn } from '@/supabase/safeInvoke';
import type { AdaptiveContentRes } from '@/types/api';

export interface ContentGenerationRequest {
  kcId: string;
  userId: string;
  difficultyLevel?: number;
  contentTypes?: string[];
  maxAtoms?: number;
  diversityPrompt?: string;
  sessionId?: string;
  forceUnique?: boolean;
}

export interface AtomSequence {
  sequence_id: string;
  atoms: any[];
  kc_id: string;
  user_id: string;
  created_at: string;
}

class ContentGenerationService {
  async generateFromDatabase(kcId: string): Promise<any[]> {
    console.log('🔍 Checking database for pre-built atoms...');
    
    // Use adaptive_content table instead of content_atoms
    const { data: existingAtoms, error } = await supabase
      .from('adaptive_content')
      .select('*')
      .eq('subject', 'math') // Simplified filtering since we don't have kc_ids
      .limit(5);

    if (error) {
      console.error('❌ Database query error:', error);
      return [];
    }

    if (existingAtoms && existingAtoms.length > 0) {
      console.log('✅ Found pre-built atoms in database:', existingAtoms.length);
      return existingAtoms.map(atom => ({
        atom_id: atom.id,
        atom_type: atom.content_type,
        content: atom.content,
        kc_ids: [kcId], // Use the provided kcId
        metadata: {
          difficulty: atom.difficulty_level,
          source: 'database',
          loadedAt: Date.now()
        }
      }));
    }

    console.log('⚠️ No pre-built atoms found in database');
    return [];
  }

  async generateFromAI(request: ContentGenerationRequest): Promise<any[]> {
    console.log('🤖 Attempting ENHANCED AI content generation...');
    
    try {
      // Extract more specific information from KC ID
      const kcParts = request.kcId.split('_');
      const subject = kcParts[1] || 'math';
      const grade = kcParts[2] || 'g4';
      const topic = kcParts.slice(3).join(' ').replace(/_/g, ' ') || 'general topic';
      
      console.log('📚 Extracted KC info:', { subject, grade, topic });

      const edgeResponse = await invokeFn<AdaptiveContentRes>('generate-content-atoms', {
        kcId: request.kcId,
        userId: request.userId,
        subject: subject,
        gradeLevel: grade,
        topic: topic,
        contentTypes: request.contentTypes || ['TEXT_EXPLANATION', 'QUESTION_MULTIPLE_CHOICE', 'INTERACTIVE_EXERCISE'],
        maxAtoms: request.maxAtoms || 3,
        diversityPrompt: request.diversityPrompt || `Create engaging ${grade} ${subject} content about ${topic}`,
        sessionId: request.sessionId,
        forceUnique: request.forceUnique,
        enhancedPrompt: true
      });

      if (edgeResponse?.atoms && edgeResponse.atoms.length > 0) {
        console.log('✅ AI generated content successfully:', edgeResponse.atoms.length, 'atoms');
        
        // Normalize the data structure to match renderer expectations
        return edgeResponse.atoms.map((atom: any) => ({
          ...atom,
          content: {
            ...atom.content,
            // Ensure both correctAnswer and correct are set for compatibility
            correctAnswer: atom.content.correctAnswer ?? atom.content.correct ?? 0,
            correct: atom.content.correct ?? atom.content.correctAnswer ?? 0
          }
        }));
      }

      console.log('⚠️ Edge Function returned no atoms');
      return [];
    } catch (error) {
      console.error('❌ AI generation failed:', error);
      return [];
    }
  }

  generateFallbackContent(kc: any): any[] {
    console.log('🔄 Generating PROPER MATH fallback content for:', kc.name);
    
    const timestamp = Date.now();
    const randomSeed = Math.floor(Math.random() * 10000);
    
    // Generate actual math questions based on the KC
    const mathQuestions = this.generateMathQuestions(kc, randomSeed);
    
    return [
      {
        atom_id: `atom_${timestamp}_1_${randomSeed}`,
        atom_type: 'TEXT_EXPLANATION',
        content: {
          title: `Understanding ${kc.name}`,
          explanation: this.getMathExplanationForKc(kc, randomSeed),
          examples: this.getMathExamplesForKc(kc, randomSeed)
        },
        kc_ids: [kc.id],
        metadata: {
          difficulty: kc.difficulty_estimate || 0.5,
          estimatedTimeMs: 30000,
          source: 'enhanced_fallback',
          generated_at: timestamp,
          randomSeed
        }
      },
      {
        atom_id: `atom_${timestamp}_2_${randomSeed}`,
        atom_type: 'QUESTION_MULTIPLE_CHOICE',
        content: mathQuestions,
        kc_ids: [kc.id],
        metadata: {
          difficulty: kc.difficulty_estimate || 0.5,
          estimatedTimeMs: 45000,
          source: 'enhanced_fallback',
          generated_at: timestamp,
          randomSeed
        }
      }
    ];
  }

  private generateMathQuestions(kc: any, seed: number) {
    const kcId = kc.id.toLowerCase();
    
    if (kcId.includes('multiply_decimals')) {
      const factor1 = (1.2 + (seed % 5) * 0.3).toFixed(1);
      const factor2 = (2.1 + (seed % 4) * 0.2).toFixed(1);
      const product = (parseFloat(factor1) * parseFloat(factor2)).toFixed(2);
      
      return {
        question: `What is ${factor1} × ${factor2}?`,
        options: [
          product,
          (parseFloat(product) + 0.5).toFixed(2),
          (parseFloat(product) - 0.3).toFixed(2),
          (parseFloat(factor1) + parseFloat(factor2)).toFixed(2)
        ],
        correctAnswer: 0,
        correct: 0,
        explanation: `To multiply decimals, multiply the numbers normally: ${factor1} × ${factor2} = ${product}`
      };
    }
    
    // Default math question
    const num1 = 12 + (seed % 20);
    const num2 = 5 + (seed % 15);
    const sum = num1 + num2;
    
    return {
      question: `What is ${num1} + ${num2}?`,
      options: [
        sum.toString(),
        (sum + 1).toString(),
        (sum - 2).toString(),
        (num1 - num2).toString()
      ],
      correctAnswer: 0,
      correct: 0,
      explanation: `${num1} + ${num2} = ${sum}`
    };
  }

  private getMathExplanationForKc(_kc: any, _seed: number) {
    return `This mathematical concept helps us solve real-world problems and builds important thinking skills.`;
  }

  private getMathExamplesForKc(kc: any, _seed: number) {
    return [`Practice helps you master ${kc.name}`];
  }
}

export default new ContentGenerationService();
```

### vite.config.ts
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
});
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@features/*": ["src/features/*"],
      "@ui/*": ["src/shared/ui/*"]
    },
    "types": ["vite/client"]
  },
  "include": ["src"]
}
```
