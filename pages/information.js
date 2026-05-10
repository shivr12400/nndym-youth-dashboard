import React from 'react';
import { Container } from '@mui/material';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import Icon from '../components/common/Icon';

const RESOURCES = [
    { label: 'Lesson Plans',    url: 'https://drive.google.com/drive/folders/1kwKNiD0sbrnNf_qE8_ZHCVpq2dpUX6Sl?usp=sharing' },
    { label: 'NNDYM Website',   url: 'https://nndym.org' },
    { label: 'Kalupur Website', url: 'https://www.swaminarayan.info/' },
    { label: 'Logos & Brand',   url: 'https://drive.google.com/drive/folders/10kBv8GkBXxqWRR-B3cWvFh2of8PO8r8m?usp=sharing' },
];

const TIER_COLUMNS = [
    { key: 'platinum', label: 'Platinum', tone: 'platinum' },
    { key: 'gold',     label: 'Gold',     tone: 'gold' },
    { key: 'silver',   label: 'Silver',   tone: 'silver' },
    { key: 'bronze',   label: 'Bronze',   tone: 'bronze' },
    { key: 'standard', label: 'Standard', tone: 'standard' },
];

const TIER_ROWS = [
    { category: 'Active Mandir Leaders',       platinum: '3',  gold: '3',  silver: '2',  bronze: '1',  standard: '1' },
    { category: 'Average Kids per Satsang',    platinum: '75', gold: '50', silver: '45', bronze: '35', standard: '30' },
    { category: 'Classes each week',           platinum: '5',  gold: '4',  silver: '3',  bronze: '2',  standard: '1' },
    { category: 'Monthly Events',              platinum: '2 / month', gold: '2 / month', silver: '1 / month', bronze: '1 every 2 mo', standard: '1 every 2 mo' },
    { category: 'Regional / National Signups', platinum: '50', gold: '45', silver: '35', bronze: '30', standard: '≤ 25' },
];

const stagger = { animate: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { duration: 0.32 } } };

export default function InformationPage() {
    return (
        <Layout>
            <Container maxWidth="lg" sx={{ pt: 5, pb: 8 }}>
                <motion.div variants={stagger} initial="initial" animate="animate">

                    <motion.div variants={fadeUp}>
                        <div className="yd-tinfo__head">
                            <h1>Tiers &amp; Information</h1>
                            <p>Resources and tier benchmarks for your mandir.</p>
                        </div>
                    </motion.div>

                    <motion.div variants={fadeUp}>
                        <div className="yd-sec" style={{ marginBottom: '1.25rem' }}>
                            <div className="yd-sec__left">
                                <span className="yd-sec__icon"><Icon name="sparkle" size={20} /></span>
                                <div>
                                    <div className="yd-sec__title">Resources</div>
                                    <div className="yd-sec__sub">Useful links for mandir leaders</div>
                                </div>
                            </div>
                        </div>
                        <div className="yd-reslist">
                            {RESOURCES.map(r => (
                                <a key={r.label} href={r.url} target="_blank" rel="noopener noreferrer" className="yd-res">
                                    <span>{r.label}</span>
                                    <Icon name="arrow-right" size={14} />
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div variants={fadeUp}>
                        <div className="yd-sec" style={{ marginBottom: '1.25rem' }}>
                            <div className="yd-sec__left">
                                <span className="yd-sec__icon"><Icon name="trophy" size={20} /></span>
                                <div>
                                    <div className="yd-sec__title">Tier requirements</div>
                                    <div className="yd-sec__sub">What you need to hit each level</div>
                                </div>
                            </div>
                        </div>
                        <div className="yd-card yd-tiertable-wrap">
                            <div className="yd-tiertable">
                                <div className="yd-tiertable__head">
                                    <div className="yd-tiertable__cell yd-tiertable__cell--cat">Requirement</div>
                                    {TIER_COLUMNS.map(c => (
                                        <div key={c.key} className={`yd-tiertable__cell yd-tiertable__head--${c.tone}`}>
                                            {c.label}
                                        </div>
                                    ))}
                                </div>
                                {TIER_ROWS.map((row, i) => (
                                    <div key={i} className="yd-tiertable__row">
                                        <div className="yd-tiertable__cell yd-tiertable__cell--cat">{row.category}</div>
                                        {TIER_COLUMNS.map(c => (
                                            <div key={c.key} className="yd-tiertable__cell">{row[c.key]}</div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                </motion.div>
            </Container>
        </Layout>
    );
}
