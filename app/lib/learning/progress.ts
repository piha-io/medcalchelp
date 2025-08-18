// Learning Progress Management for both authenticated and anonymous users

export interface LearningProgress {
  completedTopics: string[];
  completedSections: { [topicId: string]: string[] };
  lastAccessed: string;
  scores: { [topicId: string]: { [sectionId: string]: number } };
}

const STORAGE_KEY = 'learn-med-math-progress';

// Get progress from localStorage for anonymous users
export function getAnonymousProgress(): LearningProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Error reading progress from localStorage:', error);
  }
  
  return {
    completedTopics: [],
    completedSections: {},
    lastAccessed: '',
    scores: {}
  };
}

// Save progress to localStorage for anonymous users
export function saveAnonymousProgress(progress: LearningProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.warn('Error saving progress to localStorage:', error);
  }
}

// Mark a topic section as completed
export function completeSection(topicId: string, sectionId: string, score?: number): void {
  const progress = getAnonymousProgress();
  
  // Initialize topic sections if not exists
  if (!progress.completedSections[topicId]) {
    progress.completedSections[topicId] = [];
  }
  
  // Add section if not already completed
  if (!progress.completedSections[topicId].includes(sectionId)) {
    progress.completedSections[topicId].push(sectionId);
  }
  
  // Save score if provided
  if (score !== undefined) {
    if (!progress.scores[topicId]) {
      progress.scores[topicId] = {};
    }
    progress.scores[topicId][sectionId] = score;
  }
  
  // Check if topic is fully completed (has concept + practice/assessment)
  const completedSections = progress.completedSections[topicId];
  const hasRequiredSections = completedSections.includes('concept') && 
    (completedSections.includes('practice') || completedSections.includes('assessment'));
  
  if (hasRequiredSections && !progress.completedTopics.includes(topicId)) {
    progress.completedTopics.push(topicId);
  }
  
  progress.lastAccessed = new Date().toISOString();
  saveAnonymousProgress(progress);
}

// Check if a section is completed
export function isSectionCompleted(topicId: string, sectionId: string): boolean {
  const progress = getAnonymousProgress();
  return progress.completedSections[topicId]?.includes(sectionId) || false;
}

// Check if a topic is completed
export function isTopicCompleted(topicId: string): boolean {
  const progress = getAnonymousProgress();
  return progress.completedTopics.includes(topicId);
}

// Get completion percentage for a level
export function getLevelProgress(topicIds: string[]): number {
  const progress = getAnonymousProgress();
  const completedCount = topicIds.filter(id => progress.completedTopics.includes(id)).length;
  return Math.round((completedCount / topicIds.length) * 100);
}

// Get section score
export function getSectionScore(topicId: string, sectionId: string): number | undefined {
  const progress = getAnonymousProgress();
  return progress.scores[topicId]?.[sectionId];
}

// Clear all progress (for testing or reset)
export function clearProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}