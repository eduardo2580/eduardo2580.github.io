/**
 * FINAL PLANS
 * Forgiveness, Gratitude, Young Christians, Beginners
 */

(function () {
    'use strict';

    // ========================================================================
    // FORGIVENESS PLAN
    // ========================================================================
    
    function buildForgivenessPlan() {
        const passages = [
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 33 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 37 },
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 42 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 43 },
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 44 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 45 },
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 50 }, { bookId: 'EXO', bookName: 'Êxodo', chapter: 10 },
            { bookId: 'LEV', bookName: 'Levítico', chapter: 4 }, { bookId: 'LEV', bookName: 'Levítico', chapter: 5 },
            { bookId: 'LEV', bookName: 'Levítico', chapter: 6 }, { bookId: 'LEV', bookName: 'Levítico', chapter: 16 },
            { bookId: 'NUM', bookName: 'Números', chapter: 5 }, { bookId: 'NUM', bookName: 'Números', chapter: 12 },
            { bookId: 'NUM', bookName: 'Números', chapter: 14 }, { bookId: 'NUM', bookName: 'Números', chapter: 20 },
            { bookId: 'DEU', bookName: 'Deuteronômio', chapter: 4 }, { bookId: 'DEU', bookName: 'Deuteronômio', chapter: 5 },
            { bookId: 'DEU', bookName: 'Deuteronômio', chapter: 9 }, { bookId: 'DEU', bookName: 'Deuteronômio', chapter: 21 },
            { bookId: 'DEU', bookName: 'Deuteronômio', chapter: 30 }, { bookId: '2SA', bookName: '2 Samuel', chapter: 12 },
            { bookId: '2SA', bookName: '2 Samuel', chapter: 14 }, { bookId: '1KI', bookName: '1 Reis', chapter: 8 },
            { bookId: '2KI', bookName: '2 Reis', chapter: 5 }, { bookId: '2CH', bookName: '2 Crônicas', chapter: 7 },
            { bookId: 'EZR', bookName: 'Esdras', chapter: 9 }, { bookId: 'NEH', bookName: 'Neemias', chapter: 9 },
            { bookId: 'EST', bookName: 'Ester', chapter: 7 }, { bookId: 'JOB', bookName: 'Jó', chapter: 42 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 25 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 32 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 38 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 51 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 85 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 86 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 103 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 109 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 130 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 143 },
            { bookId: 'ISA', bookName: 'Isaías', chapter: 1 }, { bookId: 'ISA', bookName: 'Isaías', chapter: 6 },
            { bookId: 'ISA', bookName: 'Isaías', chapter: 43 }, { bookId: 'ISA', bookName: 'Isaías', chapter: 44 },
            { bookId: 'ISA', bookName: 'Isaías', chapter: 53 }, { bookId: 'ISA', bookName: 'Isaías', chapter: 55 },
            { bookId: 'ISA', bookName: 'Isaías', chapter: 61 }, { bookId: 'JER', bookName: 'Jeremias', chapter: 3 },
            { bookId: 'JER', bookName: 'Jeremias', chapter: 31 }, { bookId: 'EZK', bookName: 'Ezequiel', chapter: 18 },
            { bookId: 'EZK', bookName: 'Ezequiel', chapter: 33 }, { bookId: 'DAN', bookName: 'Daniel', chapter: 9 },
            { bookId: 'HOS', bookName: 'Oséias', chapter: 1 }, { bookId: 'HOS', bookName: 'Oséias', chapter: 2 },
            { bookId: 'HOS', bookName: 'Oséias', chapter: 3 }, { bookId: 'HOS', bookName: 'Oséias', chapter: 11 },
            { bookId: 'HOS', bookName: 'Oséias', chapter: 14 }, { bookId: 'JON', bookName: 'Jonas', chapter: 3 },
            { bookId: 'JON', bookName: 'Jonas', chapter: 4 }, { bookId: 'MIC', bookName: 'Miquéias', chapter: 6 },
            { bookId: 'MIC', bookName: 'Miquéias', chapter: 7 }, { bookId: 'MAT', bookName: 'Mateus', chapter: 6 },
            { bookId: 'MAT', bookName: 'Mateus', chapter: 9 }, { bookId: 'MAT', bookName: 'Mateus', chapter: 18 },
            { bookId: 'MAT', bookName: 'Mateus', chapter: 26 }, { bookId: 'MAT', bookName: 'Mateus', chapter: 27 },
            { bookId: 'MRK', bookName: 'Marcos', chapter: 11 }, { bookId: 'LUK', bookName: 'Lucas', chapter: 6 },
            { bookId: 'LUK', bookName: 'Lucas', chapter: 7 }, { bookId: 'LUK', bookName: 'Lucas', chapter: 15 },
            { bookId: 'LUK', bookName: 'Lucas', chapter: 17 }, { bookId: 'LUK', bookName: 'Lucas', chapter: 23 },
            { bookId: 'JHN', bookName: 'João', chapter: 8 }, { bookId: 'JHN', bookName: 'João', chapter: 20 },
            { bookId: 'JHN', bookName: 'João', chapter: 21 }, { bookId: 'ACT', bookName: 'Atos', chapter: 2 },
            { bookId: 'ACT', bookName: 'Atos', chapter: 3 }, { bookId: 'ACT', bookName: 'Atos', chapter: 10 },
            { bookId: 'ACT', bookName: 'Atos', chapter: 13 }, { bookId: 'ACT', bookName: 'Atos', chapter: 26 },
            { bookId: 'ROM', bookName: 'Romanos', chapter: 3 }, { bookId: 'ROM', bookName: 'Romanos', chapter: 5 },
            { bookId: '2CO', bookName: '2 Coríntios', chapter: 2 }, { bookId: '2CO', bookName: '2 Coríntios', chapter: 5 },
            { bookId: 'EPH', bookName: 'Efésios', chapter: 1 }, { bookId: 'EPH', bookName: 'Efésios', chapter: 4 },
            { bookId: 'COL', bookName: 'Colossenses', chapter: 1 }, { bookId: 'COL', bookName: 'Colossenses', chapter: 2 },
            { bookId: 'COL', bookName: 'Colossenses', chapter: 3 }, { bookId: '1JN', bookName: '1 João', chapter: 1 },
            { bookId: '1JN', bookName: '1 João', chapter: 2 }, { bookId: '1JN', bookName: '1 João', chapter: 4 }
        ];
        const plan = []; for (let i = 0; i < 30; i++) { const start = i * 3; plan.push(passages.slice(start, start + 3)); }
        return plan;
    }

    const PLAN_FORGIVENESS = buildForgivenessPlan();
    window.PLAN_FORGIVENESS = PLAN_FORGIVENESS;

    // ========================================================================
    // GRATITUDE PLAN
    // ========================================================================
    
    function buildGratitudePlan() {
        const passages = [
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 1 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 2 },
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 8 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 9 },
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 12 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 13 },
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 14 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 15 },
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 17 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 21 },
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 22 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 24 },
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 26 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 28 },
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 32 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 35 },
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 37 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 39 },
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 41 }, { bookId: 'EXO', bookName: 'Êxodo', chapter: 15 },
            { bookId: 'EXO', bookName: 'Êxodo', chapter: 16 }, { bookId: 'EXO', bookName: 'Êxodo', chapter: 17 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 7 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 9 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 18 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 19 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 28 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 29 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 30 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 32 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 33 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 34 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 35 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 40 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 41 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 42 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 43 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 47 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 48 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 56 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 57 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 59 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 63 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 65 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 66 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 67 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 68 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 75 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 84 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 89 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 90 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 91 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 92 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 95 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 96 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 97 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 98 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 100 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 103 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 105 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 106 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 107 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 111 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 113 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 115 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 116 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 117 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 118 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 135 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 136 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 138 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 139 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 145 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 146 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 147 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 148 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 149 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 150 },
            { bookId: '1CH', bookName: '1 Crônicas', chapter: 16 }, { bookId: '1CH', bookName: '1 Crônicas', chapter: 17 },
            { bookId: '1CH', bookName: '1 Crônicas', chapter: 29 }, { bookId: '2CH', bookName: '2 Crônicas', chapter: 5 },
            { bookId: '2CH', bookName: '2 Crônicas', chapter: 7 }, { bookId: 'EZR', bookName: 'Esdras', chapter: 3 },
            { bookId: 'NEH', bookName: 'Neemias', chapter: 8 }, { bookId: 'NEH', bookName: 'Neemias', chapter: 12 },
            { bookId: 'LUK', bookName: 'Lucas', chapter: 17 }, { bookId: 'COL', bookName: 'Colossenses', chapter: 3 },
            { bookId: '1TH', bookName: '1 Tessalonicenses', chapter: 5 }
        ];
        const plan = []; for (let i = 0; i < 30; i++) { const start = i * 5; plan.push(passages.slice(start, start + 5)); }
        return plan;
    }

    const PLAN_GRATITUDE = buildGratitudePlan();
    window.PLAN_GRATITUDE = PLAN_GRATITUDE;

    // ========================================================================
    // YOUNG CHRISTIANS PLAN
    // ========================================================================
    
    function buildYoungChristiansPlan() {
        const passages = [
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 1 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 2 },
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 3 }, { bookId: 'EXO', bookName: 'Êxodo', chapter: 20 },
            { bookId: 'DEU', bookName: 'Deuteronômio', chapter: 6 }, { bookId: 'JOS', bookName: 'Josuê', chapter: 1 },
            { bookId: '1SA', bookName: '1 Samuel', chapter: 17 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 1 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 23 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 27 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 37 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 119 },
            { bookId: 'PRO', bookName: 'Provérbios', chapter: 1 }, { bookId: 'PRO', bookName: 'Provérbios', chapter: 3 },
            { bookId: 'PRO', bookName: 'Provérbios', chapter: 4 }, { bookId: 'ECC', bookName: 'Eclesiastes', chapter: 12 },
            { bookId: 'ISA', bookName: 'Isaías', chapter: 6 }, { bookId: 'ISA', bookName: 'Isaías', chapter: 40 },
            { bookId: 'ISA', bookName: 'Isaías', chapter: 53 }, { bookId: 'DAN', bookName: 'Daniel', chapter: 1 },
            { bookId: 'DAN', bookName: 'Daniel', chapter: 3 }, { bookId: 'DAN', bookName: 'Daniel', chapter: 6 },
            { bookId: 'MAT', bookName: 'Mateus', chapter: 5 }, { bookId: 'MAT', bookName: 'Mateus', chapter: 6 },
            { bookId: 'MAT', bookName: 'Mateus', chapter: 7 }, { bookId: 'MAT', bookName: 'Mateus', chapter: 13 },
            { bookId: 'MAT', bookName: 'Mateus', chapter: 14 }, { bookId: 'MAT', bookName: 'Mateus', chapter: 18 },
            { bookId: 'MAT', bookName: 'Mateus', chapter: 19 }, { bookId: 'MAT', bookName: 'Mateus', chapter: 22 },
            { bookId: 'MAT', bookName: 'Mateus', chapter: 25 }, { bookId: 'MAT', bookName: 'Mateus', chapter: 26 },
            { bookId: 'MAT', bookName: 'Mateus', chapter: 28 }, { bookId: 'MRK', bookName: 'Marcos', chapter: 1 },
            { bookId: 'MRK', bookName: 'Marcos', chapter: 4 }, { bookId: 'MRK', bookName: 'Marcos', chapter: 8 },
            { bookId: 'MRK', bookName: 'Marcos', chapter: 10 }, { bookId: 'LUK', bookName: 'Lucas', chapter: 6 },
            { bookId: 'LUK', bookName: 'Lucas', chapter: 10 }, { bookId: 'LUK', bookName: 'Lucas', chapter: 12 },
            { bookId: 'LUK', bookName: 'Lucas', chapter: 15 }, { bookId: 'JHN', bookName: 'João', chapter: 1 },
            { bookId: 'JHN', bookName: 'João', chapter: 3 }, { bookId: 'JHN', bookName: 'João', chapter: 4 },
            { bookId: 'JHN', bookName: 'João', chapter: 14 }, { bookId: 'JHN', bookName: 'João', chapter: 15 },
            { bookId: 'JHN', bookName: 'João', chapter: 17 }, { bookId: 'ACT', bookName: 'Atos', chapter: 1 },
            { bookId: 'ACT', bookName: 'Atos', chapter: 2 }, { bookId: 'ACT', bookName: 'Atos', chapter: 4 },
            { bookId: 'ACT', bookName: 'Atos', chapter: 8 }, { bookId: 'ACT', bookName: 'Atos', chapter: 10 },
            { bookId: 'ACT', bookName: 'Atos', chapter: 12 }, { bookId: 'ACT', bookName: 'Atos', chapter: 16 },
            { bookId: 'ROM', bookName: 'Romanos', chapter: 3 }, { bookId: 'ROM', bookName: 'Romanos', chapter: 5 },
            { bookId: 'ROM', bookName: 'Romanos', chapter: 8 }, { bookId: 'ROM', bookName: 'Romanos', chapter: 12 },
            { bookId: '1CO', bookName: '1 Coríntios', chapter: 1 }, { bookId: '1CO', bookName: '1 Coríntios', chapter: 12 },
            { bookId: '1CO', bookName: '1 Coríntios', chapter: 13 }, { bookId: '1CO', bookName: '1 Coríntios', chapter: 15 },
            { bookId: '2CO', bookName: '2 Coríntios', chapter: 4 }, { bookId: '2CO', bookName: '2 Coríntios', chapter: 5 },
            { bookId: 'GAL', bookName: 'Gálatas', chapter: 2 }, { bookId: 'GAL', bookName: 'Gálatas', chapter: 5 },
            { bookId: 'EPH', bookName: 'Efésios', chapter: 2 }, { bookId: 'EPH', bookName: 'Efésios', chapter: 4 },
            { bookId: 'EPH', bookName: 'Efésios', chapter: 6 }, { bookId: 'PHP', bookName: 'Filipenses', chapter: 2 },
            { bookId: 'PHP', bookName: 'Filipenses', chapter: 4 }, { bookId: 'COL', bookName: 'Colossenses', chapter: 3 },
            { bookId: '1TH', bookName: '1 Tessalonicenses', chapter: 4 }, { bookId: '1TH', bookName: '1 Tessalonicenses', chapter: 5 },
            { bookId: '2TH', bookName: '2 Tessalonicenses', chapter: 2 }, { bookId: '2TH', bookName: '2 Tessalonicenses', chapter: 3 },
            { bookId: '1TI', bookName: '1 Timóteo', chapter: 4 }, { bookId: '2TI', bookName: '2 Timóteo', chapter: 2 },
            { bookId: 'TIT', bookName: 'Tito', chapter: 2 }, { bookId: 'PHM', bookName: 'Filemom', chapter: 1 },
            { bookId: 'HEB', bookName: 'Hebreus', chapter: 11 }, { bookId: 'HEB', bookName: 'Hebreus', chapter: 12 },
            { bookId: 'JAS', bookName: 'Tiago', chapter: 1 }, { bookId: 'JAS', bookName: 'Tiago', chapter: 2 },
            { bookId: 'JAS', bookName: 'Tiago', chapter: 3 }, { bookId: 'JAS', bookName: 'Tiago', chapter: 4 },
            { bookId: 'JAS', bookName: 'Tiago', chapter: 5 }, { bookId: '1PE', bookName: '1 Pedro', chapter: 1 },
            { bookId: '1PE', bookName: '1 Pedro', chapter: 2 }, { bookId: '1PE', bookName: '1 Pedro', chapter: 5 },
            { bookId: '2PE', bookName: '2 Pedro', chapter: 1 }, { bookId: '1JN', bookName: '1 João', chapter: 1 },
            { bookId: '1JN', bookName: '1 João', chapter: 2 }, { bookId: '1JN', bookName: '1 João', chapter: 4 },
            { bookId: 'REV', bookName: 'Apocalipse', chapter: 1 }, { bookId: 'REV', bookName: 'Apocalipse', chapter: 21 },
            { bookId: 'REV', bookName: 'Apocalipse', chapter: 22 }
        ];
        const plan = []; for (let i = 0; i < 60; i++) { const start = i * 2; plan.push(passages.slice(start, start + 2)); }
        return plan;
    }

    const PLAN_YOUNG_CHRISTIANS = buildYoungChristiansPlan();
    window.PLAN_YOUNG_CHRISTIANS = PLAN_YOUNG_CHRISTIANS;

    // ========================================================================
    // BEGINNERS PLAN
    // ========================================================================
    
    function buildBeginnersPlan() {
        const passages = [
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 1 }, { bookId: 'GEN', bookName: 'Gênesis', chapter: 2 },
            { bookId: 'GEN', bookName: 'Gênesis', chapter: 3 }, { bookId: 'EXO', bookName: 'Êxodo', chapter: 20 },
            { bookId: 'PSA', bookName: 'Salmos', chapter: 23 }, { bookId: 'PSA', bookName: 'Salmos', chapter: 1 },
            { bookId: 'PRO', bookName: 'Provérbios', chapter: 3 }, { bookId: 'ISA', bookName: 'Isaías', chapter: 6 },
            { bookId: 'ISA', bookName: 'Isaías', chapter: 53 }, { bookId: 'MAT', bookName: 'Mateus', chapter: 5 },
            { bookId: 'MAT', bookName: 'Mateus', chapter: 6 }, { bookId: 'MAT', bookName: 'Mateus', chapter: 7 },
            { bookId: 'MAT', bookName: 'Mateus', chapter: 11 }, { bookId: 'MAT', bookName: 'Mateus', chapter: 13 },
            { bookId: 'MAT', bookName: 'Mateus', chapter: 18 }, { bookId: 'MAT', bookName: 'Mateus', chapter: 22 },
            { bookId: 'MAT', bookName: 'Mateus', chapter: 26 }, { bookId: 'MRK', bookName: 'Marcos', chapter: 1 },
            { bookId: 'MRK', bookName: 'Marcos', chapter: 4 }, { bookId: 'LUK', bookName: 'Lucas', chapter: 10 },
            { bookId: 'LUK', bookName: 'Lucas', chapter: 15 }, { bookId: 'JHN', bookName: 'João', chapter: 1 },
            { bookId: 'JHN', bookName: 'João', chapter: 3 }, { bookId: 'JHN', bookName: 'João', chapter: 14 },
            { bookId: 'JHN', bookName: 'João', chapter: 17 }, { bookId: 'ACT', bookName: 'Atos', chapter: 2 },
            { bookId: 'ACT', bookName: 'Atos', chapter: 8 }, { bookId: 'ROM', bookName: 'Romanos', chapter: 3 },
            { bookId: 'ROM', bookName: 'Romanos', chapter: 5 }, { bookId: 'ROM', bookName: 'Romanos', chapter: 8 },
            { bookId: '1CO', bookName: '1 Coríntios', chapter: 13 }, { bookId: 'EPH', bookName: 'Efésios', chapter: 2 },
            { bookId: 'PHP', bookName: 'Filipenses', chapter: 4 }, { bookId: 'COL', bookName: 'Colossenses', chapter: 3 },
            { bookId: '1TH', bookName: '1 Tessalonicenses', chapter: 5 }, { bookId: 'JAS', bookName: 'Tiago', chapter: 1 },
            { bookId: '1PE', bookName: '1 Pedro', chapter: 2 }, { bookId: '1JN', bookName: '1 João', chapter: 4 },
            { bookId: 'REV', bookName: 'Apocalipse', chapter: 21 }
        ];
        const plan = []; for (let i = 0; i < 30; i++) { plan.push([passages[i]]); }
        return plan;
    }

    const PLAN_BEGINNERS = buildBeginnersPlan();
    window.PLAN_BEGINNERS = PLAN_BEGINNERS;

    // ========================================================================
    // GENERIC PLAN VIEW FUNCTIONS
    // ========================================================================
    
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
    const forgiveness = createGenericPlanFunctions('forgiveness', PLAN_FORGIVENESS, 30);
    const gratitude = createGenericPlanFunctions('gratitude', PLAN_GRATITUDE, 30);
    const youngChristians = createGenericPlanFunctions('young-christians', PLAN_YOUNG_CHRISTIANS, 60);
    const beginners = createGenericPlanFunctions('beginners', PLAN_BEGINNERS, 30);

    // Expose to window
    window.openForgivenessWelcome = forgiveness.openWelcomeScreen;
    window.openForgivenessDashboard = forgiveness.openDashboard;
    window.openForgivenessReading = forgiveness.openReading;

    window.openGratitudeWelcome = gratitude.openWelcomeScreen;
    window.openGratitudeDashboard = gratitude.openDashboard;
    window.openGratitudeReading = gratitude.openReading;

    window.openYoungChristiansWelcome = youngChristians.openWelcomeScreen;
    window.openYoungChristiansDashboard = youngChristians.openDashboard;
    window.openYoungChristiansReading = youngChristians.openReading;

    window.openBeginnersWelcome = beginners.openWelcomeScreen;
    window.openBeginnersDashboard = beginners.openDashboard;
    window.openBeginnersReading = beginners.openReading;

    // Sidebar integration
    function buildSidebar() {
        const container = document.getElementById('dailyBooks') || document.getElementById('teensBooks');
        if (!container) return;
        
        const plans = [
            { id: 'forgiveness', name: 'Perdão', icon: 'ph-hand-heart' },
            { id: 'gratitude', name: 'Gratidão', icon: 'ph-hands-clapping' },
            { id: 'young-christians', name: 'Jovens Cristãos', icon: 'ph-sparkle' },
            { id: 'beginners', name: 'Iniciantes', icon: 'ph-book' }
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
                    if (window[`open${p.id.replace(/-/g, '').charAt(0).toUpperCase() + p.id.replace(/-/g, '').slice(1)}Welcome`]) {
                        window[`open${p.id.replace(/-/g, '').charAt(0).toUpperCase() + p.id.replace(/-/g, '').slice(1)}Welcome`]();
                    } else if (window[`open${p.id.replace(/-/g, '')}Welcome`]) {
                        window[`open${p.id.replace(/-/g, '')}Welcome`]();
                    }
                } else {
                    if (window[`open${p.id.replace(/-/g, '').charAt(0).toUpperCase() + p.id.replace(/-/g, '').slice(1)}Dashboard`]) {
                        window[`open${p.id.replace(/-/g, '').charAt(0).toUpperCase() + p.id.replace(/-/g, '').slice(1)}Dashboard`](1);
                    } else if (window[`open${p.id.replace(/-/g, '')}Dashboard`]) {
                        window[`open${p.id.replace(/-/g, '')}Dashboard`](1);
                    }
                }
            });
            container.appendChild(btn);
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildSidebar);
    else buildSidebar();

})();
