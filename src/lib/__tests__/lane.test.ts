/**
 * Tests for the lane classifier (deriveLane).
 *
 * Lane drives the dashboard's signal-vs-overclaim triage, so the precedence
 * order is the part that matters most: a crypto company or a "founding" title
 * has to win over a generic engineering/recruiting keyword. These tests pin
 * that order so a future tweak to one branch can't silently reorder the rest.
 */
import { describe, expect, it } from 'vitest'
import { deriveLane, ALL_LANES, LANE_COLOR } from '../lane'

describe('deriveLane', () => {
  describe('CRYPTO (strongest signal)', () => {
    it('matches a crypto-native source', () => {
      expect(deriveLane({ source: 'cryptojobslist' })).toBe('CRYPTO')
    })
    it('matches a known crypto company by case-insensitive substring', () => {
      expect(deriveLane({ company: 'Coinbase' })).toBe('CRYPTO')
      expect(deriveLane({ company: 'Anchorage Digital' })).toBe('CRYPTO')
      expect(deriveLane({ company: '0x Labs' })).toBe('CRYPTO')
    })
    it('matches a crypto ATS url', () => {
      expect(deriveLane({ url: 'https://jobs.lever.co/anchorage/123' })).toBe('CRYPTO')
    })
    it('matches a web3 title keyword', () => {
      expect(deriveLane({ title: 'Blockchain Protocol Lead' })).toBe('CRYPTO')
      expect(deriveLane({ title: 'On-Chain Data Analyst' })).toBe('CRYPTO')
    })
  })

  describe('one lane per title keyword', () => {
    it.each([
      ['Chief of Staff', 'OPERATOR'],
      ['Founding Account Executive', 'OPERATOR'],
      ['Head of Operations', 'OPERATOR'],
      ['Customer Support Specialist', 'SUPPORT'],
      ['CX Lead', 'SUPPORT'],
      ['Technical Recruiter', 'RECRUITING'],
      ['Talent Acquisition Partner', 'RECRUITING'],
      ['Sourcer', 'RECRUITING'],
      ['Customer Success Manager', 'CSM'],
      ['Account Executive', 'CSM'],
      ['Growth Marketing Lead', 'MARKETING'],
      ['Developer Relations Engineer', 'MARKETING'],
      ['Community Manager', 'MARKETING'],
      ['Software Engineer', 'ENGINEERING'],
      ['Senior Backend Developer', 'ENGINEERING'],
      ['Registered Nurse', 'OTHER'],
    ])('classifies %j as %s', (title, lane) => {
      expect(deriveLane({ title })).toBe(lane)
    })
  })

  describe('precedence (order matters)', () => {
    it('a web3 title beats the engineering keyword', () => {
      expect(deriveLane({ title: 'Web3 Software Engineer' })).toBe('CRYPTO')
    })
    it('a founding title beats the engineering keyword', () => {
      expect(deriveLane({ title: 'Founding Engineer' })).toBe('OPERATOR')
    })
    it('a support title beats the engineering keyword', () => {
      expect(deriveLane({ title: 'Customer Support Engineer' })).toBe('SUPPORT')
    })
    it('a crypto company beats a recruiting title', () => {
      expect(deriveLane({ title: 'Technical Recruiter', company: 'Coinbase' })).toBe('CRYPTO')
    })
    it('a crypto source beats a marketing title', () => {
      expect(deriveLane({ title: 'Marketing Manager', source: 'web3career' })).toBe('CRYPTO')
    })
  })

  describe('case-insensitivity and empty input', () => {
    it('lowercases before matching', () => {
      expect(deriveLane({ title: 'SOFTWARE ENGINEER' })).toBe('ENGINEERING')
      expect(deriveLane({ company: 'KRAKEN' })).toBe('CRYPTO')
    })
    it('returns OTHER for empty, null, or unclassifiable input', () => {
      expect(deriveLane({})).toBe('OTHER')
      expect(deriveLane({ title: null, company: null, source: null, url: null })).toBe('OTHER')
      expect(deriveLane({ title: 'Logistics Coordinator' })).toBe('OTHER')
    })
  })
})

describe('lane metadata invariants', () => {
  it('LANE_COLOR has a chip + dot entry for every lane in ALL_LANES', () => {
    for (const lane of ALL_LANES) {
      expect(LANE_COLOR[lane]).toBeDefined()
      expect(LANE_COLOR[lane].chip).toBeTruthy()
      expect(LANE_COLOR[lane].dot).toBeTruthy()
    }
    // and no stray colors for lanes that don't exist
    expect(Object.keys(LANE_COLOR).sort()).toEqual([...ALL_LANES].sort())
  })
})
