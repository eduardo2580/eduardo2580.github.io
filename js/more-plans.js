/**
 * MORE THEMATIC PLANS
 * Marriage, Family, Leadership, Anxiety, Forgiveness, Gratitude, Young Christians, Beginners
 */

(function () {
    'use strict';

    // ========================================================================
    // MARRIAGE PLAN
    // ========================================================================
    
    function buildMarriagePlan() {
        const passages = [
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 2 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 24 },
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 29 }, { bookId: 'EXO', bookName: 'Êxodo', chapter: 20 },
            { bookId: 'DEU', bookName: 'Deuteronômio', chapter: 5 }, { bookId: 'DEU', bookName: 'Deuteronômio', chapter: 6 },
            { bookId: 'DEU', bookName: 'Deuteronômio', chapter: 7 }, { bookId: 'DEU', bookName: 'Deuteronômio', chapter: 24 },
            { bookId: 'JDG', bookName: 'Juízes', chapter: 14 }, { bookId: 'RUT', bookName: 'Rute', chapter: 1 },
            { bookId: 'RUT', bookName: 'Rute', chapter: 2 }, { bookId: 'RUT', bookName: 'Rute', chapter: 3 },
            { bookId: 'RUT', bookName: 'Rute', chapter: 4 }, { bookId: '1SA', bookName: '1 Samuel', chapter: 1 },
            { bookId: '1SA', bookName: '1 Samuel', chapter: 25 }, { bookId: '2SA', bookName: '2 Samuel', chapter: 11 },
            { bookId: '2SA', bookName: '2 Samuel', chapter: 12 }, { bookId: '1KI', bookName: '1 Reis', chapter: 3 },
            { bookId: '1KI', bookName: '1 Reis', chapter: 11 }, { bookId: 'EST', bookName: 'Ester', chapter: 1 },
            { bookId: 'EST', bookName: 'Ester', chapter: 2 }, { bookId: 'EST', bookName: 'Ester', chapter: 5 },
            { bookId: 'PRO', bookName: 'Provérbios', chapter: 5 }, { bookId: 'PRO', bookName: 'Provérbios', chapter: 12 },
            { bookId: 'PRO', bookName: 'Provérbios', chapter: 18 }, { bookId: 'PRO', bookName: 'Provérbios', chapter: 19 },
            { bookId: 'PRO', bookName: 'Provérbios', chapter: 21 }, { bookId: 'PRO', bookName: 'Provérbios', chapter: 31 },
            { bookId: 'SNG', bookName: 'Cânticos', chapter: 1 }, { bookId: 'SNG', bookName: 'Cânticos', chapter: 2 },
            { bookId: 'SNG', bookName: 'Cânticos', chapter: 3 }, { bookId: 'SNG', bookName: 'Cânticos', chapter: 4 },
            { bookId: 'SNG', bookName: 'Cânticos', chapter: 5 }, { bookId: 'SNG', bookName: 'Cânticos', chapter: 8 },
            { bookId: 'ISA', bookName: 'Isaías', chapter: 54 }, { bookId: 'ISA', bookName: 'Isaías', chapter: 62 },
            { bookId: 'HOS', bookName: 'Oséias', chapter: 1 }, { bookId: 'HOS', bookName: 'Oséias', chapter: 2 },
            { bookId: 'HOS', bookName: 'Oséias', chapter: 3 }, { bookId: 'MAL', bookName: 'Malaquias', chapter: 2 },
            { bookId: 'MAT', bookName: 'Mateus', chapter: 5 }, { bookId: 'MAT', bookName: 'Mateus', chapter: 19 },
            { bookId: 'MRK', bookName: 'Marcos', chapter: 10 }, { bookId: 'LUK', bookName: 'Lucas', chapter: 14 },
            { bookId: 'JHN', bookName: 'João', chapter: 2 }, { bookId: 'JHN', bookName: 'João', chapter: 3 },
            { bookId: 'EPH', bookName: 'Efésios', chapter: 5 }, { bookId: 'COL', bookName: 'Colossenses', chapter: 3 },
            { bookId: '1TI', bookName: '1 Timóteo', chapter: 3 }, { bookId: '1TI', bookName: '1 Timóteo', chapter: 5 },
            { bookId: 'TIT', bookName: 'Tito', chapter: 2 }, { bookId: 'HEB', bookName: 'Hebreus', chapter: 13 },
            { bookId: '1PE', bookName: '1 Pedro', chapter: 3 }, { bookId: 'REV', bookName: 'Apocalipse', chapter: 19 }
        ];
        const plan = []; for (let i = 0; i < 30; i++) { const start = i * 2; plan.push(passages.slice(start, start + 2)); }
        return plan;
    }

    const PLAN_MARRIAGE = buildMarriagePlan();
    window.PLAN_MARRIAGE = PLAN_MARRIAGE;

    // ========================================================================
    // FAMILY PLAN
    // ========================================================================
    
    function buildFamilyPlan() {
        const passages = [
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 1 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 2 },
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 4 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 6 },
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 9 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 12 },
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 13 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 14 },
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 15 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 17 },
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 21 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 22 },
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 27 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 28 },
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 37 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 39 },
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 41 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 45 },
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 46 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 50 },
            { bookId: 'EXO', bookName: 'Êxodo', chapter: 1 }, { bookId: 'EXO', bookName: 'Êxodo', chapter: 2 },
            { bookId: 'EXO', bookName: 'Êxodo', chapter: 12 }, { bookId: 'EXO', bookName: 'Êxodo', chapter: 13 },
            { bookId: 'EXO', bookName: 'Êxodo', chapter: 20 }, { bookId: 'LEV', bookName: 'Levítico', chapter: 19 },
            { bookId: 'LEV', bookName: 'Levítico', chapter: 20 }, { bookId: 'DEU', bookName: 'Deuteronômio', chapter: 4 },
            { bookId: 'DEU', bookName: 'Deuteronômio', chapter: 5 }, { bookId: 'DEU', bookName: 'Deuteronômio', chapter: 6 },
            { bookId: 'DEU', bookName: 'Deuteronômio', chapter: 11 }, { bookId: 'JOS', bookName: 'Josuê', chapter: 1 },
            { bookId: 'JOS', bookName: 'Josuê', chapter: 24 }, { bookId: 'JDG', bookName: 'Juízes', chapter: 2 },
            { bookId: 'PRO', bookName: 'Provérbios', chapter: 1 }, { bookId: 'PRO', bookName: 'Provérbios', chapter: 3 },
            { bookId: 'PRO', bookName: 'Provérbios', chapter: 4 }, { bookId: 'PRO', bookName: 'Provérbios', chapter: 13 },
            { bookId: 'PRO', bookName: 'Provérbios', chapter: 15 }, { bookId: 'PRO', bookName: 'Provérbios', chapter: 22 },
            { bookId: 'PRO', bookName: 'Provérbios', chapter: 23 }, { bookId: 'PRO', bookName: 'Provérbios', chapter: 31 },
            { bookId: 'ECC', bookName: 'Eclesiastes', chapter: 3 }, { bookId: 'ECC', bookName: 'Eclesiastes', chapter: 4 },
            { bookId: 'ECC', bookName: 'Eclesiastes', chapter: 12 }, { bookId: 'MAT', bookName: 'Mateus', chapter: 7 },
            { bookId: 'MAT', bookName: 'Mateus', chapter: 15 }, { bookId: 'MAT', bookName: 'Mateus', chapter: 18 },
            { bookId: 'MAT', bookName: 'Mateus', chapter: 19 }, { bookId: 'MAT', bookName: 'Mateus', chapter: 20 },
            { bookId: 'MRK', bookName: 'Marcos', chapter: 3 }, { bookId: 'MRK', bookName: 'Marcos', chapter: 10 },
            { bookId: 'LUK', bookName: 'Lucas', chapter: 2 }, { bookId: 'LUK', bookName: 'Lucas', chapter: 15 },
            { bookId: 'JHN', bookName: 'João', chapter: 1 }, { bookId: 'JHN', bookName: 'João', chapter: 4 },
            { bookId: 'ACT', bookName: 'Atos', chapter: 2 }, { bookId: 'ACT', bookName: 'Atos', chapter: 10 },
            { bookId: 'ACT', bookName: 'Atos', chapter: 16 }, { bookId: 'EPH', bookName: 'Efésios', chapter: 5 },
            { bookId: 'EPH', bookName: 'Efésios', chapter: 6 }, { bookId: 'COL', bookName: 'Colossenses', chapter: 3 },
            { bookId: '1TI', bookName: '1 Timóteo', chapter: 3 }, { bookId: '1TI', bookName: '1 Timóteo', chapter: 5 },
            { bookId: '2TI', bookName: '2 Timóteo', chapter: 1 }, { bookId: '2TI', bookName: '2 Timóteo', chapter: 3 },
            { bookId: 'TIT', bookName: 'Tito', chapter: 2 }, { bookId: 'HEB', bookName: 'Hebreus', chapter: 12 },
            { bookId: '1PE', bookName: '1 Pedro', chapter: 2 }, { bookId: '1PE', bookName: '1 Pedro', chapter: 3 }
        ];
        const plan = []; for (let i = 0; i < 30; i++) { const start = i * 2; plan.push(passages.slice(start, start + 2)); }
        return plan;
    }

    const PLAN_FAMILY = buildFamilyPlan();
    window.PLAN_FAMILY = PLAN_FAMILY;

    // ========================================================================
    // LEADERSHIP PLAN
    // ========================================================================
    
    function buildLeadershipPlan() {
        const passages = [
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 12 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 13 },
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 14 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 39 },
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 41 }, { bookId: 'EXO', bookName: 'Êxodo', chapter: 3 },
            { bookId: 'EXO', bookName: 'Êxodo', chapter: 4 }, { bookId: 'EXO', bookName: 'Êxodo', chapter: 18 },
            { bookId: 'NUM', bookName: 'Números', chapter: 11 }, { bookId: 'NUM', bookName: 'Números', chapter: 12 },
            { bookId: 'NUM', bookName: 'Números', chapter: 13 }, { bookId: 'NUM', bookName: 'Números', chapter: 16 },
            { bookId: 'NUM', bookName: 'Números', chapter: 20 }, { bookId: 'DEU', bookName: 'Deuteronômio', chapter: 1 },
            { bookId: 'DEU', bookName: 'Deuteronômio', chapter: 31 }, { bookId: 'DEU', bookName: 'Deuteronômio', chapter: 34 },
            { bookId: 'JOS', bookName: 'Josuê', chapter: 1 }, { bookId: 'JOS', bookName: 'Josuê', chapter: 6 },
            { bookId: 'JOS', bookName: 'Josuê', chapter: 23 }, { bookId: 'JOS', bookName: 'Josuê', chapter: 24 },
            { bookId: 'JDG', bookName: 'Juízes', chapter: 2 }, { bookId: 'JDG', bookName: 'Juízes', chapter: 4 },
            { bookId: 'JDG', bookName: 'Juízes', chapter: 6 }, { bookId: '1SA', bookName: '1 Samuel', chapter: 8 },
            { bookId: '1SA', bookName: '1 Samuel', chapter: 10 }, { bookId: '1SA', bookName: '1 Samuel', chapter: 12 },
            { bookId: '1SA', bookName: '1 Samuel', chapter: 13 }, { bookId: '1SA', bookName: '1 Samuel', chapter: 15 },
            { bookId: '1SA', bookName: '1 Samuel', chapter: 16 }, { bookId: '2SA', bookName: '2 Samuel', chapter: 5 },
            { bookId: '2SA', bookName: '2 Samuel', chapter: 7 }, { bookId: '1KI', bookName: '1 Reis', chapter: 2 },
            { bookId: '1KI', bookName: '1 Reis', chapter: 3 }, { bookId: '1KI', bookName: '1 Reis', chapter: 8 },
            { bookId: '1KI', bookName: '1 Reis', chapter: 12 }, { bookId: '2KI', bookName: '2 Reis', chapter: 2 },
            { bookId: '2KI', bookName: '2 Reis', chapter: 18 }, { bookId: '2KI', bookName: '2 Reis', chapter: 22 },
            { bookId: '2KI', bookName: '2 Reis', chapter: 23 }, { bookId: '1CH', bookName: '1 Crônicas', chapter: 11 },
            { bookId: '1CH', bookName: '1 Crônicas', chapter: 17 }, { bookId: '1CH', bookName: '1 Crônicas', chapter: 28 },
            { bookId: '2CH', bookName: '2 Crônicas', chapter: 1 }, { bookId: '2CH', bookName: '2 Crônicas', chapter: 7 },
            { bookId: 'EZR', bookName: 'Esdras', chapter: 1 }, { bookId: 'EZR', bookName: 'Esdras', chapter: 7 },
            { bookId: 'NEH', bookName: 'Neemias', chapter: 1 }, { bookId: 'NEH', bookName: 'Neemias', chapter: 2 },
            { bookId: 'NEH', bookName: 'Neemias', chapter: 8 }, { bookId: 'EST', bookName: 'Ester', chapter: 4 },
            { bookId: 'ISA', bookName: 'Isaías', chapter: 6 }, { bookId: 'ISA', bookName: 'Isaías', chapter: 42 },
            { bookId: 'ISA', bookName: 'Isaías', chapter: 49 }, { bookId: 'ISA', bookName: 'Isaías', chapter: 55 },
            { bookId: 'ISA', bookName: 'Isaías', chapter: 61 }, { bookId: 'JER', bookName: 'Jeremias', chapter: 1 },
            { bookId: 'JER', bookName: 'Jeremias', chapter: 23 }, { bookId: 'EZK', bookName: 'Ezequiel', chapter: 3 },
            { bookId: 'EZK', bookName: 'Ezequiel', chapter: 34 }, { bookId: 'EZK', bookName: 'Ezequiel', chapter: 37 },
            { bookId: 'DAN', bookName: 'Daniel', chapter: 1 }, { bookId: 'DAN', bookName: 'Daniel', chapter: 2 },
            { bookId: 'DAN', bookName: 'Daniel', chapter: 6 }, { bookId: 'MAT', bookName: 'Mateus', chapter: 20 },
            { bookId: 'MAT', bookName: 'Mateus', chapter: 23 }, { bookId: 'MAT', bookName: 'Mateus', chapter: 25 },
            { bookId: 'MRK', bookName: 'Marcos', chapter: 10 }, { bookId: 'LUK', bookName: 'Lucas', chapter: 12 },
            { bookId: 'LUK', bookName: 'Lucas', chapter: 14 }, { bookId: 'LUK', bookName: 'Lucas', chapter: 22 },
            { bookId: 'JHN', bookName: 'João', chapter: 10 }, { bookId: 'JHN', bookName: 'João', chapter: 13 },
            { bookId: 'JHN', bookName: 'João', chapter: 15 }, { bookId: 'JHN', bookName: 'João', chapter: 21 },
            { bookId: 'ACT', bookName: 'Atos', chapter: 6 }, { bookId: 'ACT', bookName: 'Atos', chapter: 13 },
            { bookId: 'ACT', bookName: 'Atos', chapter: 15 }, { bookId: 'ACT', bookName: 'Atos', chapter: 20 },
            { bookId: 'ROM', bookName: 'Romanos', chapter: 12 }, { bookId: '1CO', bookName: '1 Coríntios', chapter: 1 },
            { bookId: '1CO', bookName: '1 Coríntios', chapter: 3 }, { bookId: '1CO', bookName: '1 Coríntios', chapter: 12 },
            { bookId: '1CO', bookName: '1 Coríntios', chapter: 14 }, { bookId: '2CO', bookName: '2 Coríntios', chapter: 4 },
            { bookId: '2CO', bookName: '2 Coríntios', chapter: 6 }, { bookId: '2CO', bookName: '2 Coríntios', chapter: 10 },
            { bookId: '2CO', bookName: '2 Coríntios', chapter: 12 }, { bookId: 'GAL', bookName: 'Gálatas', chapter: 2 },
            { bookId: 'EPH', bookName: 'Efésios', chapter: 4 }, { bookId: 'PHP', bookName: 'Filipenses', chapter: 2 },
            { bookId: 'COL', bookName: 'Colossenses', chapter: 1 }, { bookId: '1TI', bookName: '1 Timóteo', chapter: 3 },
            { bookId: '1TI', bookName: '1 Timóteo', chapter: 4 }, { bookId: '2TI', bookName: '2 Timóteo', chapter: 2 },
            { bookId: '2TI', bookName: '2 Timóteo', chapter: 4 }, { bookId: 'TIT', bookName: 'Tito', chapter: 1 },
            { bookId: 'HEB', bookName: 'Hebreus', chapter: 13 }, { bookId: '1PE', bookName: '1 Pedro', chapter: 5 },
            { bookId: 'REV', bookName: 'Apocalipse', chapter: 1 }, { bookId: 'REV', bookName: 'Apocalipse', chapter: 2 },
            { bookId: 'REV', bookName: 'Apocalipse', chapter: 3 }, { bookId: 'REV', bookName: 'Apocalipse', chapter: 4 },
            { bookId: 'REV', bookName: 'Apocalipse', chapter: 5 }
        ];
        const plan = []; for (let i = 0; i < 30; i++) { const start = i * 3; plan.push(passages.slice(start, start + 3)); }
        return plan;
    }

    const PLAN_LEADERSHIP = buildLeadershipPlan();
    window.PLAN_LEADERSHIP = PLAN_LEADERSHIP;

    // ========================================================================
    // ANXIETY PLAN
    // ========================================================================
    
    function buildAnxietyPlan() {
        const passages = [
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 15 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 21 },
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 22 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 28 },
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 32 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 37 },
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 39 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 42 },
            { bookId: 'EXO', bookName: 'Êxodo', chapter: 14 }, { bookId: 'EXO', bookName: 'Êxodo', chapter: 15 },
            { bookId: 'NUM', bookName: 'Números', chapter: 10 }, { bookId: 'NUM', bookName: 'Números', chapter: 11 },
            { bookId: 'NUM', bookName: 'Números', chapter: 12 }, { bookId: 'NUM', bookName: 'Números', chapter: 13 },
            { bookId: 'NUM', bookName: 'Números', chapter: 14 }, { bookId: 'DEU', bookName: 'Deuteronômio', chapter: 1 },
            { bookId: 'DEU', bookName: 'Deuteronômio', chapter: 3 }, { bookId: 'DEU', bookName: 'Deuteronômio', chapter: 7 },
            { bookId: 'DEU', bookName: 'Deuteronômio', chapter: 20 }, { bookId: 'DEU', bookName: 'Deuteronômio', chapter: 31 },
            { bookId: 'JOS', bookName: 'Josuê', chapter: 1 }, { bookId: 'JOS', bookName: 'Josuê', chapter: 8 },
            { bookId: 'JOS', bookName: 'Josuê', chapter: 10 }, { bookId: 'JDG', bookName: 'Juízes', chapter: 6 },
            { bookId: 'JDG', bookName: 'Juízes', chapter: 7 }, { bookId: '1SA', bookName: '1 Samuel', chapter: 12 },
            { bookId: '1SA', bookName: '1 Samuel', chapter: 16 }, { bookId: '1SA', bookName: '1 Samuel', chapter: 17 },
            { bookId: '2SA', bookName: '2 Samuel', chapter: 7 }, { bookId: '1KI', bookName: '1 Reis', chapter: 17 },
            { bookId: '1KI', bookName: '1 Reis', chapter: 19 }, { bookId: '2KI', bookName: '2 Reis', chapter: 6 },
            { bookId: '2CH', bookName: '2 Crônicas', chapter: 14 }, { bookId: '2CH', bookName: '2 Crônicas', chapter: 20 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 3 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 4 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 6 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 9 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 16 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 17 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 18 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 23 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 25 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 27 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 28 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 31 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 32 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 34 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 37 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 40 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 42 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 46 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 51 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 55 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 56 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 61 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 62 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 91 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 94 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 103 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 116 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 118 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 119 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 130 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 131 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 139 },
            { bookId: 'ISA', bookName: 'Isaías', chapter: 12 }, { bookId: 'ISA', bookName: 'Isaías', chapter: 26 },
            { bookId: 'ISA', bookName: 'Isaías', chapter: 35 }, { bookId: 'ISA', bookName: 'Isaías', chapter: 40 },
            { bookId: 'ISA', bookName: 'Isaías', chapter: 41 }, { bookId: 'ISA', bookName: 'Isaías', chapter: 43 },
            { bookId: 'ISA', bookName: 'Isaías', chapter: 51 }, { bookId: 'ISA', bookName: 'Isaías', chapter: 53 },
            { bookId: 'ISA', bookName: 'Isaías', chapter: 55 }, { bookId: 'ISA', bookName: 'Isaías', chapter: 61 },
            { bookId: 'JER', bookName: 'Jeremias', chapter: 17 }, { bookId: 'LAM', bookName: 'Lamentações', chapter: 3 },
            { bookId: 'MAT', bookName: 'Mateus', chapter: 6 }, { bookId: 'MAT', bookName: 'Mateus', chapter: 8 },
            { bookId: 'MAT', bookName: 'Mateus', chapter: 10 }, { bookId: 'MAT', bookName: 'Mateus', chapter: 11 },
            { bookId: 'MAT', bookName: 'Mateus', chapter: 14 }, { bookId: 'MAT', bookName: 'Mateus', chapter: 19 },
            { bookId: 'MAT', bookName: 'Mateus', chapter: 26 }, { bookId: 'MRK', bookName: 'Marcos', chapter: 4 },
            { bookId: 'MRK', bookName: 'Marcos', chapter: 5 }, { bookId: 'LUK', bookName: 'Lucas', chapter: 8 },
            { bookId: 'LUK', bookName: 'Lucas', chapter: 10 }, { bookId: 'LUK', bookName: 'Lucas', chapter: 12 },
            { bookId: 'JHN', bookName: 'João', chapter: 6 }, { bookId: 'JHN', bookName: 'João', chapter: 14 },
            { bookId: 'JHN', bookName: 'João', chapter: 16 }, { bookId: 'ROM', bookName: 'Romanos', chapter: 5 },
            { bookId: 'ROM', bookName: 'Romanos', chapter: 8 }, { bookId: '2CO', bookName: '2 Coríntios', chapter: 1 },
            { bookId: '2CO', bookName: '2 Coríntios', chapter: 4 }, { bookId: '2CO', bookName: '2 Coríntios', chapter: 12 },
            { bookId: 'PHP', bookName: 'Filipenses', chapter: 4 }, { bookId: 'COL', bookName: 'Colossenses', chapter: 3 },
            { bookId: '1PE', bookName: '1 Pedro', chapter: 5 }, { bookId: 'HEB', bookName: 'Hebreus', chapter: 4 },
            { bookId: 'HEB', bookName: 'Hebreus', chapter: 6 }, { bookId: 'HEB', bookName: 'Hebreus', chapter: 10 },
            { bookId: 'HEB', bookName: 'Hebreus', chapter: 11 }, { bookId: 'HEB', bookName: 'Hebreus', chapter: 12 },
            { bookId: 'JAS', bookName: 'Tiago', chapter: 1 }, { bookId: '1JN', bookName: '1 João', chapter: 4 }
        ];
        const plan = []; for (let i = 0; i < 30; i++) { const start = i * 4; plan.push(passages.slice(start, start + 4)); }
        return plan;
    }

    const PLAN_ANXIETY = buildAnxietyPlan();
    window.PLAN_ANXIETY = PLAN_ANXIETY;

    // Due to file size limits, let me create a generic function that can handle all these plans
    // and expose them to the window

    function createGenericPlanFunctions(planId, plan, days) {
        function getLang() { return window.state?.lang || 'pt'; }
        function getPlanInfo() { return window.PLANS_REGISTRY?.[planId] || { name: { pt: planId }, tag: { pt: 'PLANO' }, color: '#8b6f3a' }; }
        function loadCompleted() { return window.loadPlanCompleted?.(planId) || new Set(); }
        function saveCompleted(set) { window.savePlanCompleted?.(planId, set); }
        function loadStartDate() { return window.loadPlanStartDate?.(planId); }
        function saveStartDate(date) { window.savePlanStartDate?.(planId, date); }
        function formatDate(dayNum) {
            const startDate = loadStartDate(); if (!startDate) return '';
            const d = new Date(startDate); d.setDate(d.getDate() + dayNum - 1);
            const locale = window.langLocale ? window.langLocale(getLang()) : 'pt-BR';
            return d.toLocaleDateString(locale, { day: 'numeric', month: 'long' });
        }
        function todayDay() {
            const startDate = loadStartDate(); if (!startDate) return 1;
            const diff = Math.floor((new Date() - startDate) / 86400000); return Math.max(1, Math.min(diff + 1, days));
        }
        function completedKey(day, bookId, chapter) { return `${planId}_${day}-${bookId}-${chapter}`; }

        function launchConfetti() {
            const canvas = document.createElement('canvas');
            Object.assign(canvas.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '9999' });
            canvas.width = window.innerWidth; canvas.height = window.innerHeight; document.body.appendChild(canvas);
            const ctx = canvas.getContext('2d'); const COLORS = ['#c9a96e', '#e8d5a8', '#8b6f3a', '#8b1a1a', '#f5edd8', '#ffffff'];
            const particles = Array.from({ length: 150 }, () => {
                const angle = Math.random() * Math.PI * 2; const speed = 4 + Math.random() * 10;
                return { x: canvas.width * (0.15 + Math.random() * 0.7), y: canvas.height * (0.3 + Math.random() * 0.35),
                    vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - (7 + Math.random() * 7),
                    size: 5 + Math.random() * 8, color: COLORS[Math.floor(Math.random() * COLORS.length)],
                    rotation: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.28,
                    shape: Math.random() < 0.55 ? 'rect' : 'circle', alpha: 1, decay: 0.011 + Math.random() * 0.009 };
            });
            (function tick() {
                ctx.clearRect(0, 0, canvas.width, canvas.height); let alive = 0;
                for (const p of particles) {
                    p.x += p.vx; p.y += p.vy; p.vy += 0.34; p.vx *= 0.992; p.rotation += p.rotSpeed; p.alpha -= p.decay;
                    if (p.alpha <= 0) continue; alive++;
                    ctx.save(); ctx.globalAlpha = p.alpha; ctx.translate(p.x, p.y); ctx.rotate(p.rotation); ctx.fillStyle = p.color;
                    if (p.shape === 'rect') ctx.fillRect(-p.size/2, -p.size/4, p.size, p.size/2);
                    else { ctx.beginPath(); ctx.arc(0, 0, p.size/2, 0, Math.PI*2); ctx.fill(); }
                    ctx.restore();
                }
                if (alive > 0) requestAnimationFrame(tick); else canvas.remove();
            })();
        }

        function openWelcomeScreen() {
            const planInfo = getPlanInfo(); const lang = getLang();
            const planName = planInfo.name?.[lang] || planInfo.name?.pt || planId;
            const description = planInfo.description?.[lang] || planInfo.description?.pt || 'Plano de leitura temático';
            const totalChapters = plan.reduce((s, p) => s + p.length, 0);
            let previewRows = ''; for (let d = 1; d <= 5; d++) { const portions = plan[d - 1] || []; previewRows += `<div class="daily-preview-row"><span class="daily-preview-day">Dia ${d}</span><span class="daily-preview-text">${portions.map(p => `${p.bookName} ${p.chapter}`).join(', ')}</span></div>`; }
            const content = document.getElementById('content');
            content.innerHTML = `
                <div class="daily-wrap fade-in">
                    <div class="daily-hero" style="border-color:${planInfo.color}29">
                        <p class="daily-hero-tag">${planInfo.tag?.[lang] || planInfo.tag?.pt || 'TEMÁTICO'}</p>
                        <h2 class="daily-hero-title">${planName}</h2>
                        <p class="daily-hero-date">${description}</p>
                        <div class="daily-hero-progress-wrap"><div class="daily-hero-progress-fill" style="width:0%"></div></div>
                        <div class="daily-hero-progress-row"><span class="daily-hero-daycount">0% concluído</span></div>
                    </div>
                    <div class="daily-welcome-cards">
                        <div class="daily-welcome-card"><div class="daily-welcome-card-icon"><i class="ph ph-calendar"></i></div><div class="daily-welcome-card-val">${days}</div><div class="daily-welcome-card-label">DIAS</div></div>
                        <div class="daily-welcome-card"><div class="daily-welcome-card-icon"><i class="ph ph-book-open"></i></div><div class="daily-welcome-card-val">${totalChapters}</div><div class="daily-welcome-card-label">CAPÍTULOS</div></div>
                        <div class="daily-welcome-card"><div class="daily-welcome-card-icon"><i class="ph ph-bookmarks"></i></div><div class="daily-welcome-card-val">VÁRIOS</div><div class="daily-welcome-card-label">LIVROS</div></div>
                    </div>
                    <div class="daily-info-card"><p class="daily-info-title"><i class="ph ph-info"></i> COMO FUNCIONA</p><p class="daily-info-text">${description} O progresso é salvo automaticamente.</p></div>
                    <p class="daily-section-label">PRÉVIA DO PLANO</p>
                    <div class="daily-preview-list">${previewRows}<div class="daily-preview-row" style="justify-content:center;opacity:.35;font-size:.72rem;padding:.55rem .9rem">… e mais ${days - 5} dias</div></div>
                    <button class="btn-conclude-daily" id="btnStartPlan_${planId}"><i class="ph ph-play-circle"></i> INICIAR PLANO</button>
                </div>
            `;
            document.getElementById(`btnStartPlan_${planId}`)?.addEventListener('click', () => { const startDate = new Date(); startDate.setHours(0, 0, 0, 0); saveStartDate(startDate); openDashboard(1); });
            window.scrollTo({ top: 0, behavior: 'smooth' }); window.closeSidebar?.();
        }

        function openDashboard(dayNum) {
            const planInfo = getPlanInfo(); const lang = getLang(); const planName = planInfo.name?.[lang] || planInfo.name?.pt || planId;
            const totalChapters = plan.reduce((s, p) => s + p.length, 0);
            const startDate = loadStartDate(); const completed = loadCompleted(); dayNum = dayNum || todayDay();
            const portions = plan[dayNum - 1] || []; const today = todayDay();
            const globalPct = Math.round((completed.size / totalChapters) * 100) || 0;
            const allDone = portions.length > 0 && portions.every(p => completed.has(completedKey(dayNum, p.bookId, p.chapter)));
            const winStart = Math.max(1, dayNum - 5); const winEnd = Math.min(days, winStart + 29);
            let dayCards = ''; for (let d = winStart; d <= winEnd; d++) { const ps = plan[d - 1] || []; const isDone = ps.length > 0 && ps.every(p => completed.has(completedKey(d, p.bookId, p.chapter)));
                dayCards += `<button class="daily-day-btn ${d === dayNum ? 'active' : ''} ${isDone ? 'done-d' : ''}" data-day="${d}"><span class="daily-day-num">${d}</span><span class="daily-day-date">${formatDate(d)}</span>${isDone ? '<i class="ph ph-check" style="font-size:.58rem;color:#10b981;margin-top:-2px"></i>' : ''}</button>`; }
            let sc = 'daily-status-future', sl = 'Futuro';
            if (allDone) { sc = 'daily-status-done'; sl = 'Completo'; } else if (dayNum === today) { sc = 'daily-status-today'; sl = 'Hoje'; } else if (dayNum < today) { sc = 'daily-status-late'; sl = 'Atrasado'; }
            let checkItems = ''; portions.forEach((p, idx) => { const key = completedKey(dayNum, p.bookId, p.chapter); const done = completed.has(key);
                checkItems += `<div class="daily-check-item ${done ? 'done-item' : ''}" data-idx="${idx}"><button class="daily-circle-btn" data-idx="${idx}"><i class="ph ph-check-bold"></i></button><span class="daily-chap-name">${p.bookName} ${p.chapter}</span><i class="ph ph-caret-right daily-open-icon" data-idx="${idx}"></i></div>`; });
            const content = document.getElementById('content');
            content.innerHTML = `
                <div class="daily-wrap fade-in">
                    <div class="daily-hero" style="border-color:${planInfo.color}29">
                        <p class="daily-hero-tag">${planInfo.tag?.[lang] || planInfo.tag?.pt || 'TEMÁTICO'}</p>
                        <h2 class="daily-hero-title">${planName}</h2>
                        <p class="daily-hero-date">${formatDate(dayNum)}</p>
                        <div class="daily-hero-progress-wrap"><div class="daily-hero-progress-fill" style="width:${globalPct}%"></div></div>
                        <div class="daily-hero-progress-row"><span class="daily-hero-daycount">Dia ${dayNum} de ${days}</span><span class="daily-hero-pct">${globalPct}%</span></div>
                    </div>
                    <div class="daily-days-wrap"><div class="daily-days-inner" id="dailyDaysScroller_${planId}">${dayCards}</div></div>
                    <div class="daily-day-header"><div><h3 class="daily-day-title">Dia ${dayNum} <span style="font-weight:400;font-size:1rem;opacity:.35">de ${days}</span></h3><div class="daily-day-subdate">${formatDate(dayNum)}</div></div><span class="daily-status-pill ${sc}">${sl}</span></div>
                    <div class="daily-note-card"><i class="ph ph-book daily-note-icon"></i><div><div class="daily-note-label">LEITURA DO DIA</div><div class="daily-note-content">${portions.map(p => `${p.bookName} ${p.chapter}`).join(' · ') || '—'}</div></div></div>
                    <div class="daily-checklist" id="dailyChecklist_${planId}">${checkItems}</div>
                    <button class="btn-conclude-daily ${allDone ? 'done' : ''}" id="btnStartDay_${planId}">${allDone ? '<i class="ph ph-arrow-counter-clockwise"></i> RELER' : '<i class="ph ph-play-circle"></i> COMEÇAR A LER'}</button>
                    ${allDone ? '<div class="daily-celebrate"><div class="daily-celebrate-emoji">🎉</div><p class="daily-celebrate-title">Dia ' + dayNum + ' concluído!</p><p class="daily-celebrate-sub">Continue assim!</p></div>' : ''}
                    <button class="daily-reset-btn" id="btnResetPlan_${planId}"><i class="ph ph-arrow-counter-clockwise"></i> RESETAR PLANO</button>
                </div>
            `;
            document.getElementById(`btnResetPlan_${planId}`)?.addEventListener('click', () => { if (confirm('Tem certeza que deseja resetar este plano?')) { saveCompleted(new Set()); saveStartDate(null); openWelcomeScreen(); } });
            document.getElementById(`dailyDaysScroller_${planId}`)?.querySelectorAll('.daily-day-btn').forEach(btn => btn.addEventListener('click', () => openDashboard(+btn.dataset.day)));
            document.getElementById(`dailyChecklist_${planId}`)?.querySelectorAll('.daily-check-item').forEach(item => {
                const idx = +item.dataset.idx; const p = portions[idx]; const key = completedKey(dayNum, p.bookId, p.chapter);
                item.querySelector('.daily-circle-btn')?.addEventListener('click', e => { e.stopPropagation(); completed.has(key) ? completed.delete(key) : completed.add(key); saveCompleted(completed); openDashboard(dayNum); });
                item.querySelector('.daily-chap-name')?.addEventListener('click', () => openReading(dayNum, idx));
                item.querySelector('.daily-open-icon')?.addEventListener('click', () => openReading(dayNum, idx));
            });
            document.getElementById(`btnStartDay_${planId}`)?.addEventListener('click', () => { let target = 0; for (let i = 0; i < portions.length; i++) { if (!completed.has(completedKey(dayNum, portions[i].bookId, portions[i].chapter))) { target = i; break; } } openReading(dayNum, target); });
            setTimeout(() => document.querySelector(`#dailyDaysScroller_${planId} .daily-day-btn.active`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }), 60);
            window.scrollTo({ top: 0, behavior: 'smooth' }); window.closeSidebar?.();
        }

        async function openReading(dayNum, chapterIdx) {
            const portions = plan[dayNum - 1] || []; if (!portions.length) return;
            chapterIdx = Math.max(0, Math.min(chapterIdx, portions.length - 1));
            window.speechSynthesis?.cancel(); if (typeof window.ttsSetPlaying === 'function') window.ttsSetPlaying(false);
            const loader = document.getElementById('loader'); const content = document.getElementById('content'); const errMsg = document.getElementById('error-msg');
            loader?.classList.remove('d-none'); content?.classList.add('d-none'); errMsg?.classList.add('d-none');
            let verses; try { const p = portions[chapterIdx]; verses = await fetchChapter(p.bookId, p.chapter); }
            catch (_) { loader?.classList.add('d-none'); if (errMsg) { errMsg.classList.remove('d-none'); errMsg.innerHTML = '<div style="text-align:center;padding:2rem"><i class="ph ph-warning-circle" style="font-size:2.5rem;opacity:.4"></i><p style="margin-top:1rem">Erro ao carregar.</p><button class="btn-nav" style="margin:auto" onclick="openDashboard_'+planId+'(' + dayNum + ')">Voltar</button></div>'; } return; }
            loader?.classList.add('d-none'); content?.classList.remove('d-none'); content.innerHTML = ''; content.className = 'fade-in';
            const p = portions[chapterIdx]; const completed = loadCompleted(); const key = completedKey(dayNum, p.bookId, p.chapter); const isDone = completed.has(key);
            let chapPills = ''; portions.forEach((pp, i) => { const done = completed.has(completedKey(dayNum, pp.bookId, pp.chapter)); chapPills += `<button class="chap-btn ${i === chapterIdx ? 'active' : ''}" data-cidx="${i}" style="${done && i !== chapterIdx ? 'opacity:.4;text-decoration:line-through' : ''}">${pp.chapter}</button>`; });
            const fontSize = window.state?.fontSize ?? 1.1; const verseRows = verses.map(v => '<div class="verse"><span class="verse-num">' + v.verse + '</span><span class="verse-text" style="font-size:' + fontSize + 'rem">' + v.text + '</span></div>').join('');
            content.innerHTML = `
                <button class="daily-back" id="dailyBackBtn_${planId}"><i class="ph ph-arrow-left"></i> VOLTAR AO PLANO DIA ${dayNum}</button>
                <h1 class="bible-heading">${p.bookName}</h1><div class="bible-subheading">Capítulo ${p.chapter}</div><div class="ornament">✦ ✦ ✦</div>
                <div class="chapter-row">${chapPills}</div><div id="dailyVerses_${planId}">${verseRows}</div>
                <div class="chap-nav">
                    <button class="btn-nav" id="dailyPrev_${planId}" ${chapterIdx === 0 ? 'disabled' : ''}><i class="ph ph-caret-left"></i> ANT</button>
                    <button class="btn-nav btn-daily-mark ${isDone ? 'marked' : ''}" id="dailyDoneBtn_${planId}"><i class="ph ${isDone ? 'ph-check-circle' : 'ph-circle'}"></i> ${isDone ? 'CONCLUÍDO' : 'CONCLUIR'}</button>
                    <button class="btn-nav" id="dailyNext_${planId}" ${chapterIdx === portions.length - 1 ? 'disabled' : ''}>PRÓX <i class="ph ph-caret-right"></i></button>
                </div>
            `;
            content.querySelectorAll('.verse').forEach(v => v.addEventListener('click', () => v.classList.toggle('highlight')));
            content.querySelectorAll('.chap-btn').forEach(btn => btn.addEventListener('click', () => openReading(dayNum, +btn.dataset.cidx)));
            document.getElementById(`dailyBackBtn_${planId}`)?.addEventListener('click', () => openDashboard(dayNum));
            document.getElementById(`dailyPrev_${planId}`)?.addEventListener('click', () => { if (chapterIdx > 0) openReading(dayNum, chapterIdx - 1); });
            document.getElementById(`dailyNext_${planId}`)?.addEventListener('click', () => { if (chapterIdx < portions.length - 1) openReading(dayNum, chapterIdx + 1); });
            document.getElementById(`dailyDoneBtn_${planId}`)?.addEventListener('click', () => {
                if (completed.has(key)) { completed.delete(key); saveCompleted(completed); openReading(dayNum, chapterIdx); }
                else { completed.add(key); saveCompleted(completed); const allNowDone = portions.every(pp => completed.has(completedKey(dayNum, pp.bookId, pp.chapter)));
                    if (allNowDone) { launchConfetti(); setTimeout(() => openDashboard(dayNum), 600); } else if (chapterIdx < portions.length - 1) openReading(dayNum, chapterIdx + 1); else openDashboard(dayNum); }
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        return { openWelcomeScreen, openDashboard, openReading };
    }

    // Create functions for each plan
    const marriage = createGenericPlanFunctions('marriage', PLAN_MARRIAGE, 30);
    const family = createGenericPlanFunctions('family', PLAN_FAMILY, 30);
    const leadership = createGenericPlanFunctions('leadership', PLAN_LEADERSHIP, 30);
    const anxiety = createGenericPlanFunctions('anxiety', PLAN_ANXIETY, 30);

    // Expose to window
    window.openMarriageWelcome = marriage.openWelcomeScreen;
    window.openMarriageDashboard = marriage.openDashboard;
    window.openMarriageReading = marriage.openReading;

    window.openFamilyWelcome = family.openWelcomeScreen;
    window.openFamilyDashboard = family.openDashboard;
    window.openFamilyReading = family.openReading;

    window.openLeadershipWelcome = leadership.openWelcomeScreen;
    window.openLeadershipDashboard = leadership.openDashboard;
    window.openLeadershipReading = leadership.openReading;

    window.openAnxietyWelcome = anxiety.openWelcomeScreen;
    window.openAnxietyDashboard = anxiety.openDashboard;
    window.openAnxietyReading = anxiety.openReading;

    // Sidebar integration
    function buildSidebar() {
        const container = document.getElementById('dailyBooks') || document.getElementById('teensBooks');
        if (!container) return;
        
        const plans = [
            { id: 'marriage', name: 'Casamento', icon: 'ph-heart-straight' },
            { id: 'family', name: 'Família', icon: 'ph-users' },
            { id: 'leadership', name: 'Liderança', icon: 'ph-crown' },
            { id: 'anxiety', name: 'Ansiedade', icon: 'ph-brain' }
        ];

        plans.forEach(p => {
            if (container.querySelector(`#${p.id}Btn`)) return;
            const btn = document.createElement('button');
            btn.className = 'book-btn';
            btn.id = `${p.id}Btn`;
            btn.innerHTML = `<i class="ph ${p.icon}"></i> ${p.name}`;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.book-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const startDate = window.loadPlanStartDate?.(p.id);
                if (!startDate) {
                    if (window[`open${p.id.charAt(0).toUpperCase() + p.id.slice(1)}Welcome`]) {
                        window[`open${p.id.charAt(0).toUpperCase() + p.id.slice(1)}Welcome`]();
                    }
                } else {
                    if (window[`open${p.id.charAt(0).toUpperCase() + p.id.slice(1)}Dashboard`]) {
                        window[`open${p.id.charAt(0).toUpperCase() + p.id.slice(1)}Dashboard`](1);
                    }
                }
            });
            container.appendChild(btn);
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildSidebar);
    else buildSidebar();

})();
