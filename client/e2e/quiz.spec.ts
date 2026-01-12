import { test, expect } from '@playwright/test';


test.describe('feature Quiz E2E', () => {
  
  test('Bonne réponse colore en vert', async ({ page }) => {
    await page.goto('http://localhost:3005/quiz');
    for (let i = 0; i < 10; i++) {
      await expect(page.locator('h2')).toBeVisible();
      const correctAnswer = page.locator('[data-testid="answer-correct"]:not([disabled])');
      await expect(correctAnswer).toBeVisible();
      await expect(correctAnswer).toBeEnabled();
      await correctAnswer.click();
      const correctDisabledBtn = page.locator('[data-testid="answer-correct"]');
      await expect(correctDisabledBtn).toHaveClass(/bg-green-400/);

      if (i < 9) {
        const nextBtn = page.getByRole('button', { name: /suivante/i });
        await expect(nextBtn).toBeEnabled();
        await nextBtn.click();
      }
    }
  });

  test('Mauvaise réponse colore en rouge', async ({ page }) => {
    await page.goto('http://localhost:3005/quiz');
    for (let i = 0; i < 10; i++) {
      await expect(page.locator('h2')).toBeVisible();
      const wrongAnswers = page.locator('[data-testid="answer-wrong"]:not([disabled])');
      const count = await wrongAnswers.count();
      if (count === 0) throw new Error('No wrong answer found!');
      const wrongAnswerBtn = wrongAnswers.nth(0);

      await expect(wrongAnswerBtn).toBeVisible();
      await expect(wrongAnswerBtn).toBeEnabled();
      await wrongAnswerBtn.click();

      const allWrongAnswers = page.locator('[data-testid="answer-wrong"]');
      await expect(allWrongAnswers.nth(0)).toHaveClass(/bg-red-400/);

      if (i < 9) {
        const nextBtn = page.getByRole('button', { name: /suivante/i });
        await expect(nextBtn).toBeEnabled();
        await nextBtn.click();
      }
    }
  });

  test('Affichage des résultats', async ({ page }) => {
    await page.goto('http://localhost:3005/quiz');
    for (let i = 0; i < 10; i++) {
      await expect(page.locator('h2')).toBeVisible();
      // Clique simplement sur la première réponse disponible pour avancer
      const answer = page.locator('button:not([disabled])').first();
      await answer.click();
      if (i < 9) {
        const nextBtn = page.getByRole('button', { name: /suivante/i });
        await expect(nextBtn).toBeEnabled();
        await nextBtn.click();
      }
    }
    const nextBtn = page.getByRole('button', { name: /suivante/i });
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();

    // Vérifie que la page de résultats est affichée avec le score
    await expect(page.getByText(/Votre score:/i)).toBeVisible();
  });

  test('Navigation arrière : impossible de reselectionner une proposition déjà choisie, couleur correcte', async ({ page }) => {
    await page.goto('http://localhost:3005/quiz');

    // 1. Répond à la première question (bonne ou mauvaise réponse selon le cas)
    await expect(page.locator('h2')).toBeVisible();

    // Clique sur le premier bouton non désactivé (peu importe si bon ou mauvais)
    const firstAnswer = page.locator('button:not([disabled])').first();
    const answerText = await firstAnswer.textContent();
    await firstAnswer.click();

    // 2. Passe à la deuxième question
    const nextBtn = page.getByRole('button', { name: /suivante/i });
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();

    // 3. Clique sur "précédente" pour revenir à la première question
    const prevBtn = page.getByRole('button', { name: /précédente/i });
    await expect(prevBtn).toBeEnabled();
    await prevBtn.click();

    // 4. Vérifie que le bouton sélectionné reste désactivé et coloré correctement
    // On récupère le bouton par son texte (pour être sûr de cibler celui cliqué)
    const selectedBtnBack = page.getByRole('button', { name: answerText?.trim() || '' });
    await expect(selectedBtnBack).toBeDisabled();
    // La couleur dépend du type de réponse
    // On vérifie que la classe contient vert OU rouge
    await expect(selectedBtnBack).toHaveClass(/bg-green-400|bg-red-400/);

    // vérifier si c'était la bonne ou mauvaise réponse en inspectant le mock ou le data-testid
    const isCorrect = await selectedBtnBack.getAttribute('data-testid') === 'answer-correct';
    if (isCorrect) {
      await expect(selectedBtnBack).toHaveClass(/bg-green-400/);
    } else {
      await expect(selectedBtnBack).toHaveClass(/bg-red-400/);
    }

  });
});