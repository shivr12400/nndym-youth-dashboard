import React from 'react';
import { Container } from '@mui/material';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import Icon from '../components/common/Icon';

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

const fadeUp = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { duration: 0.32 } } };

export default function MandirTiers() {
    return (
        <Layout>
            <Container maxWidth="lg" sx={{ pt: 5, pb: 8 }}>
                <motion.div initial="initial" animate="animate" variants={fadeUp}>

                    <div className="yd-tinfo__head">
                        <h1>Mandir Tiers</h1>
                        <p>Compare goals and requirements across all levels.</p>
                    </div>

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
            </Container>
        </Layout>
    );
}
