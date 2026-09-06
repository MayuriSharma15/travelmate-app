// app/admin/index.jsx

import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator, Dimensions, FlatList, Modal,
  RefreshControl, SafeAreaView, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../../configs/FirebaseConfig';

const { width: W } = Dimensions.get('window');

// ── Hard-coded light colors — ignores system dark mode ────────────────────────
const BLUE    = '#007bff';
const BLUE2   = '#0056b3';
const BLUEBG  = '#e8f0fe';
const BG      = '#f5f7fa';
const WHITE   = '#ffffff';
const TEXT    = '#111827';
const TEXT2   = '#6b7280';
const TEXT3   = '#9ca3af';
const BORDER  = '#e5e7eb';
const GREEN   = '#16a34a';
const GREENBG = '#dcfce7';
const RED     = '#dc2626';
const REDBG   = '#fee2e2';
const AMBER   = '#d97706';
const AMBERBG = '#fef3c7';
const GRAYBG  = '#f3f4f6';

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'grid-outline',     iconActive: 'grid'     },
  { id: 'users',    label: 'Users',    icon: 'people-outline',   iconActive: 'people'   },
  { id: 'trips',    label: 'Trips',    icon: 'map-outline',      iconActive: 'map'      },
  { id: 'analytics',label: 'Analytics',icon: 'bar-chart-outline',iconActive: 'bar-chart'},
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const getInitials = (name = '', email = '') => {
  const src = name?.trim() || email || '?';
  const parts = src.trim().split(' ');
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : src.slice(0, 2).toUpperCase();
};

const formatDate = (val) => {
  if (!val) return 'Unknown';
  const d = val?.toDate ? val.toDate() : new Date(val);
  if (isNaN(d)) return 'Unknown';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const timeAgo = (val) => {
  if (!val) return '';
  const d = val?.toDate ? val.toDate() : new Date(val);
  if (isNaN(d)) return '';
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1)  return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24)  return `${hrs}h ago`;
  if (days < 30) return `${days}d ago`;
  return formatDate(val);
};

// ── Shared components ─────────────────────────────────────────────────────────
const Pill = ({ label, bg, color }) => (
  <View style={{ backgroundColor: bg, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 99 }}>
    <Text style={{ color, fontSize: 11, fontWeight: '700', fontFamily: 'Outfit-Medium' }}>{label}</Text>
  </View>
);

const Avatar = ({ name, email, size = 40 }) => {
  const ini = getInitials(name, email);
  const cols = [
    ['#dbeafe', BLUE], ['#dcfce7', GREEN], ['#fef3c7', AMBER],
    ['#f3e8ff', '#7c3aed'], ['#ffe4e6', RED],
  ];
  const [bg, fg] = cols[(ini.charCodeAt(0) || 0) % cols.length];
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: fg, fontWeight: '800', fontSize: size * 0.33, fontFamily: 'Outfit-Bold' }}>{ini}</Text>
    </View>
  );
};

const Card = ({ children, style }) => (
  <View style={[S.card, style]}>{children}</View>
);

const Row = ({ children, last }) => (
  <View style={[S.row, last && { borderBottomWidth: 0 }]}>{children}</View>
);

const SearchBar = ({ value, onChange, placeholder }) => (
  <View style={S.searchBar}>
    <Ionicons name="search-outline" size={17} color={TEXT3} />
    <TextInput
      style={{ flex: 1, paddingVertical: 11, color: TEXT, fontSize: 14, fontFamily: 'Outfit-Regular' }}
      placeholder={placeholder}
      placeholderTextColor={TEXT3}
      value={value}
      onChangeText={onChange}
    />
    {!!value && (
      <TouchableOpacity onPress={() => onChange('')}>
        <Ionicons name="close-circle" size={17} color={TEXT3} />
      </TouchableOpacity>
    )}
  </View>
);

const Empty = ({ icon, msg }) => (
  <View style={{ alignItems: 'center', paddingVertical: 40 }}>
    <View style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: BLUEBG, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
      <Ionicons name={icon} size={26} color={BLUE} />
    </View>
    <Text style={{ color: TEXT2, fontSize: 14, fontFamily: 'Outfit-Regular', textAlign: 'center' }}>{msg}</Text>
  </View>
);

const SectionHead = ({ title, badge }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
    <Text style={{ color: TEXT, fontSize: 16, fontWeight: '800', fontFamily: 'Outfit-Bold' }}>{title}</Text>
    {badge !== undefined && (
      <View style={{ backgroundColor: BLUEBG, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
        <Text style={{ color: BLUE, fontSize: 12, fontWeight: '700', fontFamily: 'Outfit-Bold' }}>{badge}</Text>
      </View>
    )}
  </View>
);

// ── OVERVIEW ──────────────────────────────────────────────────────────────────
function OverviewScreen({ users, trips, loading }) {
  const travellers = users.filter(u => u.role !== 'admin').length;
  const admins     = users.filter(u => u.role === 'admin').length;
  const totalDays  = trips.reduce((s, t) => s + (Number(t.tripData?.totalDays) || 0), 0);

  const destCount = {};
  trips.forEach(t => {
    const n = t.tripData?.locationInfo?.name;
    if (n) destCount[n] = (destCount[n] || 0) + 1;
  });
  const topDests = Object.entries(destCount).sort((a, b) => b[1] - a[1]).slice(0, 4);

  const recentUsers = [...users]
    .sort((a, b) => {
      const da = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || a.metadata?.creationTime || 0);
      const db_ = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || b.metadata?.creationTime || 0);
      return db_ - da;
    })
    .slice(0, 5);

  const recentTrips = trips.slice(0, 3);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: BG }}
      refreshControl={<RefreshControl refreshing={loading} tintColor={BLUE} />}
    >
      {/* Hero */}
      <LinearGradient colors={[BLUE, BLUE2]} style={S.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={S.orb1} /><View style={S.orb2} />
        <Text style={S.heroEye}>ADMIN CONSOLE</Text>
        <Text style={S.heroTitle}>Platform Overview</Text>
        <Text style={S.heroSub}>
          {loading ? 'Loading data...' : `${users.length} users · ${trips.length} trips · ${totalDays} days planned`}
        </Text>
      </LinearGradient>

      <View style={{ padding: 16 }}>
        {/* Stat grid */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
          <Card style={{ flex: 1, padding: 14 }}>
            <View style={[S.iconBox, { backgroundColor: BLUEBG }]}>
              <Ionicons name="people" size={18} color={BLUE} />
            </View>
            <Text style={S.statLabel}>Total Users</Text>
            <Text style={S.statVal}>{loading ? '—' : users.length}</Text>
          </Card>
          <Card style={{ flex: 1, padding: 14 }}>
            <View style={[S.iconBox, { backgroundColor: GREENBG }]}>
              <Ionicons name="person" size={18} color={GREEN} />
            </View>
            <Text style={S.statLabel}>Travellers</Text>
            <Text style={S.statVal}>{loading ? '—' : travellers}</Text>
          </Card>
        </View>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          <Card style={{ flex: 1, padding: 14 }}>
            <View style={[S.iconBox, { backgroundColor: AMBERBG }]}>
              <Ionicons name="map" size={18} color={AMBER} />
            </View>
            <Text style={S.statLabel}>Trips Created</Text>
            <Text style={S.statVal}>{loading ? '—' : trips.length}</Text>
          </Card>
          <Card style={{ flex: 1, padding: 14 }}>
            <View style={[S.iconBox, { backgroundColor: REDBG }]}>
              <Ionicons name="calendar" size={18} color={RED} />
            </View>
            <Text style={S.statLabel}>Total Days</Text>
            <Text style={S.statVal}>{loading ? '—' : totalDays}</Text>
          </Card>
        </View>

        {/* Recent Users */}
        <Card style={{ marginBottom: 12 }}>
          <SectionHead title="Recent Sign-Ups" badge={`${users.length} total`} />
          {loading ? (
            <ActivityIndicator color={BLUE} style={{ paddingVertical: 20 }} />
          ) : recentUsers.length === 0 ? (
            <Empty icon="people-outline" msg={'No users in Firestore yet.\nSee fix instructions below.'} />
          ) : (
            recentUsers.map((u, i) => (
              <Row key={u.uid || u.id} last={i === recentUsers.length - 1}>
                <Avatar name={u.displayName || u.name} email={u.email} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={S.rowName} numberOfLines={1}>{u.displayName || u.name || 'No name'}</Text>
                  <Text style={S.rowSub}  numberOfLines={1}>{u.email}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Pill label={u.role === 'admin' ? 'Admin' : 'User'} bg={u.role === 'admin' ? AMBERBG : BLUEBG} color={u.role === 'admin' ? AMBER : BLUE} />
                  <Text style={S.rowTime}>{timeAgo(u.createdAt || u.metadata?.creationTime)}</Text>
                </View>
              </Row>
            ))
          )}
        </Card>

        {/* Recent Trips */}
        {recentTrips.length > 0 && (
          <Card style={{ marginBottom: 12 }}>
            <SectionHead title="Recent Trips" badge={`${trips.length} total`} />
            {recentTrips.map((t, i) => (
              <Row key={t.docId || t.id} last={i === recentTrips.length - 1}>
                <View style={[S.iconBox, { backgroundColor: BLUEBG }]}>
                  <Ionicons name="location" size={18} color={BLUE} />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={S.rowName} numberOfLines={1}>{t.tripData?.locationInfo?.name || 'Unknown'}</Text>
                  <Text style={S.rowSub}>{t.tripData?.totalDays || '?'} days · {t.userEmail}</Text>
                </View>
                <Text style={S.rowTime}>{timeAgo(t.createdAt)}</Text>
              </Row>
            ))}
          </Card>
        )}

        {/* Top Destinations */}
        {topDests.length > 0 && (
          <Card style={{ marginBottom: 12 }}>
            <SectionHead title="Top Destinations" />
            {topDests.map(([name, count], i) => (
              <Row key={name} last={i === topDests.length - 1}>
                <View style={{ width: 28, height: 28, borderRadius: 7, backgroundColor: BLUEBG, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: BLUE, fontSize: 12, fontWeight: '800' }}>{i + 1}</Text>
                </View>
                <Text style={{ flex: 1, color: TEXT, fontSize: 13, fontFamily: 'Outfit-Medium', marginLeft: 10 }} numberOfLines={1}>{name}</Text>
                <Pill label={`${count} trip${count > 1 ? 's' : ''}`} bg={BLUEBG} color={BLUE} />
              </Row>
            ))}
          </Card>
        )}

        {/* Fix notice if 0 users */}
        {!loading && users.length === 0 && (
          <Card style={{ borderColor: '#fde68a', backgroundColor: AMBERBG }}>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
              <Ionicons name="information-circle" size={20} color={AMBER} style={{ marginTop: 1 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: AMBER, fontSize: 14, fontWeight: '700', fontFamily: 'Outfit-Bold', marginBottom: 4 }}>
                  0 users showing?
                </Text>
                <Text style={{ color: '#92400e', fontSize: 12, fontFamily: 'Outfit-Regular', lineHeight: 18 }}>
                  Your old signup didn't save to Firestore. The new signup code (auth-signup-index.js) fixes this — replace app/auth/signup/index.js with it, then create a new test account.
                </Text>
              </View>
            </View>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}

// ── USERS ─────────────────────────────────────────────────────────────────────
function UsersScreen({ users, trips, loading, onRefresh }) {
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');
  const [selected, setSelected] = useState(null);

  const list = users.filter(u => {
    const name  = u.displayName || u.name || '';
    const email = u.email || '';
    const matchQ = (name + email).toLowerCase().includes(search.toLowerCase());
    const matchF = filter === 'all' || u.role === filter;
    return matchQ && matchF;
  });

  const userTrips = selected ? trips.filter(t => t.userEmail === selected.email) : [];

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <View style={{ padding: 16, paddingBottom: 0 }}>
        <SectionHead title="Users" badge={`${users.length} accounts`} />
        <SearchBar value={search} onChange={setSearch} placeholder="Search name or email..." />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[['all','All'],['user','Travellers'],['admin','Admins']].map(([v, l]) => (
              <TouchableOpacity key={v} onPress={() => setFilter(v)}
                style={[S.filterBtn, filter === v && S.filterBtnOn]}>
                <Text style={[S.filterTxt, filter === v && { color: BLUE }]}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <FlatList
        data={list}
        keyExtractor={u => u.uid || u.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor={BLUE} />}
        ListEmptyComponent={
          loading
            ? <ActivityIndicator color={BLUE} style={{ marginTop: 40 }} />
            : <Empty icon="people-outline" msg="No users found" />
        }
        renderItem={({ item: u }) => {
          const uTrips = trips.filter(t => t.userEmail === u.email);
          const name   = u.displayName || u.name || '';
          return (
            <TouchableOpacity onPress={() => setSelected(u)} activeOpacity={0.7}>
              <Card style={{ marginBottom: 10, padding: 14 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Avatar name={name} email={u.email} size={44} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={S.rowName}>{name || 'No name set'}</Text>
                    <Text style={S.rowSub} numberOfLines={1}>{u.email}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
                      <Pill label={u.role === 'admin' ? 'Admin' : 'User'} bg={u.role === 'admin' ? AMBERBG : BLUEBG} color={u.role === 'admin' ? AMBER : BLUE} />
                      {uTrips.length > 0 && (
                        <Pill label={`${uTrips.length} trip${uTrips.length > 1 ? 's' : ''}`} bg={GREENBG} color={GREEN} />
                      )}
                      <Text style={S.rowTime}>{timeAgo(u.createdAt || u.metadata?.creationTime)}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={TEXT3} />
                </View>
              </Card>
            </TouchableOpacity>
          );
        }}
      />

      {/* User detail sheet */}
      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <View style={S.overlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setSelected(null)} />
          <View style={[S.sheet, { backgroundColor: WHITE }]}>
            <View style={S.handle} />
            {selected && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                  <Avatar name={selected.displayName || selected.name} email={selected.email} size={68} />
                  <Text style={{ color: TEXT, fontSize: 19, fontWeight: '800', fontFamily: 'Outfit-Bold', marginTop: 12 }}>
                    {selected.displayName || selected.name || 'No name'}
                  </Text>
                  <Text style={{ color: TEXT2, fontSize: 13, fontFamily: 'Outfit-Regular', marginTop: 3 }}>{selected.email}</Text>
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                    <Pill label={selected.role === 'admin' ? 'Admin' : 'User'} bg={selected.role === 'admin' ? AMBERBG : BLUEBG} color={selected.role === 'admin' ? AMBER : BLUE} />
                    {userTrips.length > 0 && <Pill label={`${userTrips.length} trips`} bg={GREENBG} color={GREEN} />}
                  </View>
                </View>

                <View style={{ backgroundColor: BG, borderRadius: 14, overflow: 'hidden', marginBottom: 14 }}>
                  {[
                    { icon: 'mail-outline',    label: 'Email',   val: selected.email || '—' },
                    { icon: 'shield-outline',  label: 'Role',    val: (selected.role || 'user').charAt(0).toUpperCase() + (selected.role || 'user').slice(1) },
                    { icon: 'calendar-outline',label: 'Joined',  val: formatDate(selected.createdAt || selected.metadata?.creationTime) },
                    { icon: 'map-outline',     label: 'Trips',   val: `${userTrips.length} trip${userTrips.length !== 1 ? 's' : ''} created` },
                  ].map((r, i, arr) => (
                    <View key={r.label} style={[S.detRow, i === arr.length - 1 && { borderBottomWidth: 0 }]}>
                      <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: BLUEBG, alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name={r.icon} size={15} color={BLUE} />
                      </View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={{ color: TEXT3, fontSize: 11, fontFamily: 'Outfit-Regular' }}>{r.label}</Text>
                        <Text style={{ color: TEXT, fontSize: 13, fontWeight: '600', fontFamily: 'Outfit-Medium', marginTop: 1 }} numberOfLines={1}>{r.val}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                {userTrips.length > 0 && (
                  <>
                    <Text style={{ color: TEXT, fontSize: 14, fontWeight: '700', fontFamily: 'Outfit-Bold', marginBottom: 10 }}>Their Trips</Text>
                    {userTrips.map(t => (
                      <Card key={t.docId || t.id} style={{ marginBottom: 8, padding: 12 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                          <View style={{ width: 34, height: 34, borderRadius: 9, backgroundColor: BLUEBG, alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name="location" size={17} color={BLUE} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={S.rowName} numberOfLines={1}>{t.tripData?.locationInfo?.name || 'Unknown'}</Text>
                            <Text style={S.rowSub}>{t.tripData?.totalDays || '?'} days · {t.tripData?.travelerInfo?.title || ''} · {t.tripData?.budgetInfo?.title || t.tripData?.budget || ''}</Text>
                          </View>
                          <Text style={S.rowTime}>{timeAgo(t.createdAt)}</Text>
                        </View>
                      </Card>
                    ))}
                  </>
                )}

                <TouchableOpacity onPress={() => setSelected(null)}
                  style={{ backgroundColor: BLUEBG, borderRadius: 12, paddingVertical: 13, alignItems: 'center', marginTop: 8 }}>
                  <Text style={{ color: BLUE, fontSize: 15, fontWeight: '700', fontFamily: 'Outfit-Medium' }}>Close</Text>
                </TouchableOpacity>
                <View style={{ height: 24 }} />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ── TRIPS ─────────────────────────────────────────────────────────────────────
function TripsScreen({ trips, loading, onRefresh }) {
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');
  const [selected, setSelected] = useState(null);

  const budgets = [...new Set(trips.map(t => t.tripData?.budgetInfo?.title || t.tripData?.budget).filter(Boolean))];

  const list = trips.filter(t => {
    const loc   = t.tripData?.locationInfo?.name || '';
    const email = t.userEmail || '';
    const matchQ = (loc + email).toLowerCase().includes(search.toLowerCase());
    const matchF = filter === 'all' || (t.tripData?.budgetInfo?.title || t.tripData?.budget) === filter;
    return matchQ && matchF;
  });

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <View style={{ padding: 16, paddingBottom: 0 }}>
        <SectionHead title="Trips" badge={`${trips.length} created`} />
        <SearchBar value={search} onChange={setSearch} placeholder="Search destination or email..." />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity onPress={() => setFilter('all')} style={[S.filterBtn, filter === 'all' && S.filterBtnOn]}>
              <Text style={[S.filterTxt, filter === 'all' && { color: BLUE }]}>All</Text>
            </TouchableOpacity>
            {budgets.map(b => (
              <TouchableOpacity key={b} onPress={() => setFilter(b)} style={[S.filterBtn, filter === b && S.filterBtnOn]}>
                <Text style={[S.filterTxt, filter === b && { color: BLUE }]}>{b}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <FlatList
        data={list}
        keyExtractor={t => t.docId || t.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor={BLUE} />}
        ListEmptyComponent={
          loading
            ? <ActivityIndicator color={BLUE} style={{ marginTop: 40 }} />
            : <Empty icon="map-outline" msg={search ? 'No trips match your search' : 'No trips yet'} />
        }
        renderItem={({ item: t }) => {
          const loc    = t.tripData?.locationInfo?.name || 'Unknown';
          const days   = t.tripData?.totalDays;
          const who    = t.tripData?.travelerInfo?.title;
          const budget = t.tripData?.budgetInfo?.title || t.tripData?.budget;
          return (
            <TouchableOpacity onPress={() => setSelected(t)} activeOpacity={0.7}>
              <Card style={{ marginBottom: 10, padding: 14 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <View style={[S.iconBox, { backgroundColor: BLUEBG, width: 44, height: 44, borderRadius: 12 }]}>
                    <Ionicons name="location" size={20} color={BLUE} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={S.rowName} numberOfLines={1}>{loc}</Text>
                    <Text style={S.rowSub} numberOfLines={1}>{t.userEmail}</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                      {days   && <View style={S.tag}><Ionicons name="calendar-outline" size={11} color={BLUE} /><Text style={S.tagTxt}>{days} days</Text></View>}
                      {who    && <View style={S.tag}><Ionicons name="people-outline"   size={11} color={BLUE} /><Text style={S.tagTxt}>{who}</Text></View>}
                      {budget && <View style={S.tag}><Ionicons name="wallet-outline"   size={11} color={BLUE} /><Text style={S.tagTxt}>{budget}</Text></View>}
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <Text style={S.rowTime}>{timeAgo(t.createdAt)}</Text>
                    <Ionicons name="chevron-forward" size={16} color={TEXT3} />
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          );
        }}
      />

      {/* Trip detail sheet */}
      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <View style={S.overlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setSelected(null)} />
          <View style={[S.sheet, { backgroundColor: WHITE }]}>
            <View style={S.handle} />
            {selected && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <View style={{ width: 50, height: 50, borderRadius: 13, backgroundColor: BLUEBG, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="location" size={24} color={BLUE} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: TEXT, fontSize: 17, fontWeight: '800', fontFamily: 'Outfit-Bold' }} numberOfLines={2}>
                      {selected.tripData?.locationInfo?.name || 'Unknown'}
                    </Text>
                    <Text style={{ color: TEXT2, fontSize: 12, fontFamily: 'Outfit-Regular', marginTop: 2 }}>{selected.userEmail}</Text>
                  </View>
                </View>

                <View style={{ backgroundColor: BG, borderRadius: 14, overflow: 'hidden', marginBottom: 14 }}>
                  {[
                    { icon: 'calendar-outline',       label: 'Duration',   val: `${selected.tripData?.totalDays || '?'} days` },
                    { icon: 'people-outline',         label: 'Travellers', val: selected.tripData?.travelerInfo?.title || `${selected.tripData?.travelerCount || '?'} people` },
                    { icon: 'wallet-outline',         label: 'Budget',     val: selected.tripData?.budgetInfo?.title || selected.tripData?.budget || '—' },
                    { icon: 'calendar-number-outline',label: 'Start Date', val: selected.tripData?.startDate || '—' },
                    { icon: 'time-outline',           label: 'Created',    val: formatDate(selected.createdAt) },
                  ].map((r, i, arr) => (
                    <View key={r.label} style={[S.detRow, i === arr.length - 1 && { borderBottomWidth: 0 }]}>
                      <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: BLUEBG, alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name={r.icon} size={15} color={BLUE} />
                      </View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={{ color: TEXT3, fontSize: 11, fontFamily: 'Outfit-Regular' }}>{r.label}</Text>
                        <Text style={{ color: TEXT, fontSize: 13, fontWeight: '600', fontFamily: 'Outfit-Medium', marginTop: 1 }}>{r.val}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                {selected.tripPlan?.itinerary && (
                  <View style={{ marginBottom: 14 }}>
                    <Text style={{ color: TEXT, fontSize: 14, fontWeight: '700', fontFamily: 'Outfit-Bold', marginBottom: 10 }}>Itinerary Preview</Text>
                    {Object.entries(selected.tripPlan.itinerary).slice(0, 3).map(([day, data]) => (
                      <Card key={day} style={{ marginBottom: 8, padding: 12 }}>
                        <Text style={{ color: BLUE, fontSize: 12, fontWeight: '700', fontFamily: 'Outfit-Bold', marginBottom: 3 }}>
                          {day.replace(/day/i, 'Day ')}
                        </Text>
                        <Text style={{ color: TEXT2, fontSize: 12, fontFamily: 'Outfit-Regular' }} numberOfLines={2}>
                          {Array.isArray(data?.places)
                            ? data.places.map(p => p.placeName || p.name).filter(Boolean).join(' · ')
                            : data?.theme || 'Planned activities'}
                        </Text>
                      </Card>
                    ))}
                  </View>
                )}

                <TouchableOpacity onPress={() => setSelected(null)}
                  style={{ backgroundColor: BLUEBG, borderRadius: 12, paddingVertical: 13, alignItems: 'center' }}>
                  <Text style={{ color: BLUE, fontSize: 15, fontWeight: '700', fontFamily: 'Outfit-Medium' }}>Close</Text>
                </TouchableOpacity>
                <View style={{ height: 24 }} />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ── ANALYTICS ─────────────────────────────────────────────────────────────────
function AnalyticsScreen({ users, trips }) {
  const totalDays   = trips.reduce((s, t) => s + (Number(t.tripData?.totalDays) || 0), 0);
  const avgDays     = trips.length ? (totalDays / trips.length).toFixed(1) : 0;

  const now         = new Date();
  const thisMonth   = trips.filter(t => {
    const d = t.createdAt?.toDate ? t.createdAt.toDate() : new Date(t.createdAt || 0);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const budgets     = trips.map(t => t.tripData?.budgetInfo?.title || t.tripData?.budget).filter(Boolean);
  const budgetMap   = budgets.reduce((a, b) => { a[b] = (a[b] || 0) + 1; return a; }, {});
  const topBudget   = Object.entries(budgetMap).sort((a, b) => b[1] - a[1])[0];

  const travMap     = trips.map(t => t.tripData?.travelerInfo?.title).filter(Boolean)
    .reduce((a, b) => { a[b] = (a[b] || 0) + 1; return a; }, {});
  const topTrav     = Object.entries(travMap).sort((a, b) => b[1] - a[1])[0];

  const destMap     = {};
  trips.forEach(t => { const n = t.tripData?.locationInfo?.name; if (n) destMap[n] = (destMap[n] || 0) + 1; });
  const destList    = Object.entries(destMap).sort((a, b) => b[1] - a[1]);
  const maxDest     = destList[0]?.[1] || 1;

  const topStats = [
    { icon: 'trending-up',  bg: GREENBG, color: GREEN, label: 'Trips This Month', val: thisMonth     },
    { icon: 'calendar',     bg: BLUEBG,  color: BLUE,  label: 'Avg Trip Length',  val: `${avgDays}d` },
    { icon: 'wallet',       bg: AMBERBG, color: AMBER, label: 'Top Budget',       val: topBudget?.[0] || '—' },
    { icon: 'people',       bg: REDBG,   color: RED,   label: 'Top Group Type',   val: topTrav?.[0]   || '—' },
  ];

  return (
    <ScrollView style={{ backgroundColor: BG }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
      <SectionHead title="Analytics" badge="Live" />

      {/* Top stats */}
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
        {topStats.slice(0, 2).map(s => (
          <Card key={s.label} style={{ flex: 1, padding: 14 }}>
            <View style={[S.iconBox, { backgroundColor: s.bg }]}><Ionicons name={s.icon} size={18} color={s.color} /></View>
            <Text style={S.statLabel}>{s.label}</Text>
            <Text style={[S.statVal, { fontSize: 20 }]}>{s.val}</Text>
          </Card>
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
        {topStats.slice(2).map(s => (
          <Card key={s.label} style={{ flex: 1, padding: 14 }}>
            <View style={[S.iconBox, { backgroundColor: s.bg }]}><Ionicons name={s.icon} size={18} color={s.color} /></View>
            <Text style={S.statLabel}>{s.label}</Text>
            <Text style={[S.statVal, { fontSize: 15 }]} numberOfLines={1}>{s.val}</Text>
          </Card>
        ))}
      </View>

      {/* Destination bar chart */}
      {destList.length > 0 && (
        <Card style={{ marginBottom: 14 }}>
          <SectionHead title="Destinations" badge={`${destList.length} places`} />
          {destList.slice(0, 8).map(([name, count]) => (
            <View key={name} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                <Text style={{ color: TEXT, fontSize: 13, fontFamily: 'Outfit-Medium', flex: 1 }} numberOfLines={1}>{name}</Text>
                <Text style={{ color: TEXT2, fontSize: 12, marginLeft: 8 }}>{count}</Text>
              </View>
              <View style={{ height: 6, backgroundColor: GRAYBG, borderRadius: 3, overflow: 'hidden' }}>
                <View style={{ height: '100%', width: `${(count / maxDest) * 100}%`, backgroundColor: BLUE, borderRadius: 3 }} />
              </View>
            </View>
          ))}
        </Card>
      )}

      {/* Budget breakdown */}
      {Object.keys(budgetMap).length > 0 && (
        <Card style={{ marginBottom: 14 }}>
          <SectionHead title="Budget Split" />
          {Object.entries(budgetMap).sort((a, b) => b[1] - a[1]).map(([b, c], i, arr) => (
            <Row key={b} last={i === arr.length - 1}>
              <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: AMBERBG, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="wallet-outline" size={15} color={AMBER} />
              </View>
              <Text style={{ flex: 1, color: TEXT, fontSize: 13, fontFamily: 'Outfit-Medium', marginLeft: 10 }}>{b}</Text>
              <Pill label={`${c} trip${c > 1 ? 's' : ''}`} bg={AMBERBG} color={AMBER} />
            </Row>
          ))}
        </Card>
      )}

      {/* Traveller types */}
      {Object.keys(travMap).length > 0 && (
        <Card style={{ marginBottom: 14 }}>
          <SectionHead title="Traveller Types" />
          {Object.entries(travMap).sort((a, b) => b[1] - a[1]).map(([t, c], i, arr) => (
            <Row key={t} last={i === arr.length - 1}>
              <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: BLUEBG, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="people-outline" size={15} color={BLUE} />
              </View>
              <Text style={{ flex: 1, color: TEXT, fontSize: 13, fontFamily: 'Outfit-Medium', marginLeft: 10 }}>{t}</Text>
              <Pill label={`${c}`} bg={BLUEBG} color={BLUE} />
            </Row>
          ))}
        </Card>
      )}

      {/* Sign out */}
      <TouchableOpacity onPress={() => router.replace('/auth/sign-in')} activeOpacity={0.85}>
        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderColor: '#fecaca', backgroundColor: '#fff5f5' }}>
          <View style={{ width: 42, height: 42, borderRadius: 11, backgroundColor: REDBG, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="log-out-outline" size={21} color={RED} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: RED, fontSize: 14, fontWeight: '700', fontFamily: 'Outfit-Bold' }}>Sign Out</Text>
            <Text style={{ color: TEXT2, fontSize: 12, fontFamily: 'Outfit-Regular', marginTop: 1 }}>Exit admin console</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={RED} />
        </Card>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [tab, setTab]         = useState('overview');
  const [users, setUsers]     = useState([]);
  const [trips, setTrips]     = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);

    // ── Fetch users from Firestore 'users' collection ─────────────────────────
    try {
      const snap = await getDocs(collection(db, 'users'));
      const firestoreUsers = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setUsers(firestoreUsers);
    } catch (e) {
      console.log('Users fetch error:', e.message);
      setUsers([]);
    }

    // ── Fetch trips from 'UserTrips' (exact name from your mytrip.jsx) ────────
    try {
      const snap = await getDocs(collection(db, 'UserTrips'));
      const tripsData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      tripsData.sort((a, b) => {
        const da  = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const db_ = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return db_ - da;
      });
      setTrips(tripsData);
    } catch (e) {
      console.log('Trips fetch error:', e.message);
      setTrips([]);
    }

    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const screen = () => {
    switch (tab) {
      case 'overview':  return <OverviewScreen  users={users} trips={trips} loading={loading} />;
      case 'users':     return <UsersScreen     users={users} trips={trips} loading={loading} onRefresh={fetchAll} />;
      case 'trips':     return <TripsScreen     trips={trips} loading={loading} onRefresh={fetchAll} />;
      case 'analytics': return <AnalyticsScreen users={users} trips={trips} />;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: WHITE }}>
      {/* Force light status bar */}
      <View style={{ backgroundColor: WHITE }}>
        <View style={S.topBar}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: TEXT, fontSize: 16, fontWeight: '800', fontFamily: 'Outfit-Bold' }}>Admin Console</Text>
            <Text style={{ color: TEXT3, fontSize: 12, fontFamily: 'Outfit-Regular', marginTop: 1 }}>
              {loading ? 'Loading...' : `${users.length} users · ${trips.length} trips`}
            </Text>
          </View>
          <TouchableOpacity onPress={fetchAll} style={S.iconBtn}>
            {loading
              ? <ActivityIndicator size="small" color={BLUE} />
              : <Ionicons name="refresh-outline" size={19} color={BLUE} />
            }
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace('/auth/sign-in')}
            style={[S.iconBtn, { backgroundColor: REDBG, borderColor: '#fecaca', marginLeft: 8 }]}>
            <Ionicons name="log-out-outline" size={19} color={RED} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flex: 1, backgroundColor: BG }}>{screen()}</View>

      {/* Bottom tab bar */}
      <View style={[S.tabBar, { backgroundColor: WHITE }]}>
        {TABS.map(t => {
          const on = tab === t.id;
          return (
            <TouchableOpacity key={t.id} onPress={() => setTab(t.id)} style={S.tabBtn} activeOpacity={0.7}>
              {on && <View style={S.tabLine} />}
              <Ionicons name={on ? t.iconActive : t.icon} size={21} color={on ? BLUE : TEXT3} />
              <Text style={[S.tabLabel, on && { color: BLUE, fontWeight: '700', fontFamily: 'Outfit-Medium' }]}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  card:       { backgroundColor: WHITE, borderRadius: 14, borderWidth: 1, borderColor: BORDER, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  hero:       { paddingHorizontal: 22, paddingTop: 24, paddingBottom: 24, overflow: 'hidden' },
  orb1:       { position: 'absolute', right: -30, top: -30,   width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.08)' },
  orb2:       { position: 'absolute', right:  50, bottom: -50, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(255,255,255,0.06)' },
  heroEye:    { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontFamily: 'Outfit-Medium', letterSpacing: 1.5, marginBottom: 6 },
  heroTitle:  { color: WHITE, fontSize: 24, fontWeight: '800', fontFamily: 'Outfit-Bold', marginBottom: 4 },
  heroSub:    { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontFamily: 'Outfit-Regular' },
  iconBox:    { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statLabel:  { color: TEXT2, fontSize: 11, fontFamily: 'Outfit-Regular', marginBottom: 3 },
  statVal:    { color: TEXT,  fontSize: 24, fontWeight: '800', fontFamily: 'Outfit-Bold'  },
  row:        { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: BORDER },
  rowName:    { color: TEXT,  fontSize: 14, fontWeight: '700', fontFamily: 'Outfit-Bold'    },
  rowSub:     { color: TEXT2, fontSize: 12, fontFamily: 'Outfit-Regular', marginTop: 2      },
  rowTime:    { color: TEXT3, fontSize: 11, fontFamily: 'Outfit-Regular'                    },
  searchBar:  { flexDirection: 'row', alignItems: 'center', backgroundColor: WHITE, borderWidth: 1.5, borderColor: BORDER, borderRadius: 12, paddingHorizontal: 13, gap: 8, marginBottom: 12 },
  filterBtn:  { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99, backgroundColor: WHITE, borderWidth: 1.5, borderColor: BORDER },
  filterBtnOn:{ backgroundColor: BLUEBG, borderColor: BLUE },
  filterTxt:  { color: TEXT2, fontSize: 13, fontWeight: '600', fontFamily: 'Outfit-Medium' },
  tag:        { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: BLUEBG, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 99 },
  tagTxt:     { color: BLUE, fontSize: 11, fontWeight: '600', fontFamily: 'Outfit-Medium' },
  overlay:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet:      { borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 22, paddingBottom: 0, maxHeight: '88%' },
  handle:     { width: 38, height: 4, backgroundColor: BORDER, borderRadius: 2, alignSelf: 'center', marginBottom: 18 },
  detRow:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: BORDER },
  topBar:     { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: BORDER },
  iconBtn:    { width: 36, height: 36, borderRadius: 9, backgroundColor: BLUEBG, borderWidth: 1, borderColor: '#bfdbfe', alignItems: 'center', justifyContent: 'center' },
  tabBar:     { flexDirection: 'row', borderTopWidth: 1, borderTopColor: BORDER, paddingBottom: 8, paddingTop: 8 },
  tabBtn:     { flex: 1, alignItems: 'center', paddingVertical: 3, position: 'relative' },
  tabLine:    { position: 'absolute', top: 0, width: 18, height: 3, backgroundColor: BLUE, borderRadius: 99 },
  tabLabel:   { color: TEXT3, fontSize: 10, fontFamily: 'Outfit-Regular', marginTop: 3 },
});